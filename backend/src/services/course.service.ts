import { Course, Lesson, Enrollment, UserStats } from '../types/prisma';
import prisma from '../config/database';
import { CourseFilter, PaginationParams } from '../types';
import { PaginationUtils } from '../utils/helpers';
import logger from '../utils/logger';

export class CourseService {
  /**
   * Get all courses with pagination and filters
   */
  static async getCourses(filters: CourseFilter = {}) {
    const { page = 1, limit = 10, category, difficulty, search } = filters;
    const { page: validPage, limit: validLimit } = PaginationUtils.validatePagination(page, limit);
    const skip = PaginationUtils.getSkip(validPage, validLimit);

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: validLimit,
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              duration: true,
              points: true,
            },
            where: {
              isPublished: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.course.count({ where }),
    ]);

    const pagination = PaginationUtils.getPaginationMeta(validPage, validLimit, total);

    return { courses, pagination };
  }

  /**
   * Get single course by ID
   */
  static async getCourseById(courseId: string, userId?: string) {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            content: true,
            videoUrl: true,
            duration: true,
            points: true,
            order: true,
          },
          where: {
            isPublished: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    let enrollment = null;
    if (userId) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    }

    return { course, enrollment };
  }

  /**
   * Enroll user in a course
   */
  static async enrollInCourse(userId: string, courseId: string): Promise<Enrollment> {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: true,
      },
    });

    logger.info(`User ${userId} enrolled in course ${courseId}`);

    return enrollment as Enrollment;
  }

  /**
   * Get user enrollments
   */
  static async getUserEnrollments(userId: string, params: PaginationParams = {}) {
    const { page = 1, limit = 10 } = params;
    const { page: validPage, limit: validLimit } = PaginationUtils.validatePagination(page, limit);
    const skip = PaginationUtils.getSkip(validPage, validLimit);

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        skip,
        take: validLimit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
              category: true,
              difficulty: true,
              duration: true,
            },
          },
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      }),
      prisma.enrollment.count({ where: { userId } }),
    ]);

    const pagination = PaginationUtils.getPaginationMeta(validPage, validLimit, total);

    return { enrollments, pagination };
  }

  /**
   * Update course progress
   */
  static async updateProgress(userId: string, courseId: string, lessonId: string) {
    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    // Get total lessons in the course
    const totalLessons = await prisma.lesson.count({
      where: {
        courseId,
        isPublished: true,
      },
    });

    // Check if lesson is already completed (create activity if not exists)
    const existingActivity = await prisma.activity.findFirst({
      where: {
        userId,
        lessonId,
        type: 'LESSON',
        isCompleted: true,
      },
    });

    if (!existingActivity) {
      // Get lesson details
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { title: true, points: true },
      });

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Create completed activity
      await prisma.activity.create({
        data: {
          userId,
          lessonId,
          type: 'LESSON',
          title: `Completed: ${lesson.title}`,
          points: lesson.points,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      // Update user stats
      await prisma.userStats.update({
        where: { userId },
        data: {
          completedLectures: {
            increment: 1,
          },
          totalPoints: {
            increment: lesson.points,
          },
          lastActivityDate: new Date(),
        },
      });
    }

    // Calculate new progress
    const completedLessons = await prisma.activity.count({
      where: {
        userId,
        type: 'LESSON',
        isCompleted: true,
        lesson: {
          courseId,
        },
      },
    });

    const progress = (completedLessons / totalLessons) * 100;
    const isCompleted = progress >= 100;

    // Update enrollment progress
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress,
        completedAt: isCompleted ? new Date() : null,
        lastAccessed: new Date(),
      },
    });

    return { progress, isCompleted };
  }

  /**
   * Get course categories
   */
  static async getCategories() {
    const categories = await prisma.course.groupBy({
      by: ['category'],
      where: {
        isPublished: true,
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    return categories;
  }
}