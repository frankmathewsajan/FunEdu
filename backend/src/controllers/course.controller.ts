import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { CourseService } from '../services/course.service';
import { ResponseUtils } from '../utils/helpers';

export class CourseController {
  /**
   * Get all courses
   */
  static async getCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await CourseService.getCourses(req.query as any);
      
      res.json(
        ResponseUtils.success('Courses retrieved successfully', result.courses, result.pagination)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get single course by ID
   */
  static async getCourseById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;
      
      const result = await CourseService.getCourseById(courseId, userId);
      
      res.json(
        ResponseUtils.success('Course retrieved successfully', result)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Enroll in a course
   */
  static async enrollInCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const { courseId } = req.body;
      
      const enrollment = await CourseService.enrollInCourse(req.user.id, courseId);
      
      res.status(201).json(
        ResponseUtils.success('Enrolled in course successfully', enrollment)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get user enrollments
   */
  static async getUserEnrollments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const result = await CourseService.getUserEnrollments(req.user.id, req.query as any);
      
      res.json(
        ResponseUtils.success('Enrollments retrieved successfully', result.enrollments, result.pagination)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update course progress
   */
  static async updateProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const { courseId, lessonId } = req.params;
      
      const result = await CourseService.updateProgress(req.user.id, courseId, lessonId);
      
      res.json(
        ResponseUtils.success('Progress updated successfully', result)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get course categories
   */
  static async getCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CourseService.getCategories();
      
      res.json(
        ResponseUtils.success('Categories retrieved successfully', categories)
      );
    } catch (error: any) {
      next(error);
    }
  }
}