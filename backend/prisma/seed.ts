import { PrismaClient } from '@prisma/client';
import { AuthUtils } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample games
    const games = await Promise.all([
      prisma.game.create({
        data: {
          title: 'Math Quiz Game',
          description: 'Test your mathematical skills with fun puzzles',
          icon: '🧮',
          difficulty: 'easy',
          maxPoints: 50,
        },
      }),
      prisma.game.create({
        data: {
          title: 'Word Puzzle',
          description: 'Expand your vocabulary with challenging word games',
          icon: '🧩',
          difficulty: 'medium',
          maxPoints: 75,
        },
      }),
      prisma.game.create({
        data: {
          title: 'Science Challenge',
          description: 'Explore the wonders of science through interactive challenges',
          icon: '🔬',
          difficulty: 'hard',
          maxPoints: 100,
        },
      }),
    ]);

    console.log('✅ Created sample games');

    // Create sample courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction to Mathematics',
          description: 'Learn the fundamentals of mathematics with interactive lessons',
          category: 'Mathematics',
          difficulty: 'beginner',
          duration: 120,
          isPublished: true,
          lessons: {
            create: [
              {
                title: 'Numbers and Operations',
                content: 'Learn about basic number operations and their properties.',
                order: 1,
                points: 10,
                duration: 30,
                isPublished: true,
              },
              {
                title: 'Fractions and Decimals',
                content: 'Understanding fractions, decimals, and their relationships.',
                order: 2,
                points: 15,
                duration: 40,
                isPublished: true,
              },
              {
                title: 'Basic Algebra',
                content: 'Introduction to variables, expressions, and simple equations.',
                order: 3,
                points: 20,
                duration: 50,
                isPublished: true,
              },
            ],
          },
        },
      }),
      prisma.course.create({
        data: {
          title: 'Creative Writing Workshop',
          description: 'Develop your writing skills through creative exercises and storytelling',
          category: 'Language Arts',
          difficulty: 'intermediate',
          duration: 90,
          isPublished: true,
          lessons: {
            create: [
              {
                title: 'Story Structure',
                content: 'Learn the basic elements of story structure: beginning, middle, and end.',
                order: 1,
                points: 12,
                duration: 30,
                isPublished: true,
              },
              {
                title: 'Character Development',
                content: 'Create compelling characters that drive your stories forward.',
                order: 2,
                points: 18,
                duration: 35,
                isPublished: true,
              },
              {
                title: 'Dialogue Writing',
                content: 'Master the art of writing realistic and engaging dialogue.',
                order: 3,
                points: 15,
                duration: 25,
                isPublished: true,
              },
            ],
          },
        },
      }),
      prisma.course.create({
        data: {
          title: 'Basic Science Exploration',
          description: 'Discover the wonders of science through hands-on experiments and observations',
          category: 'Science',
          difficulty: 'beginner',
          duration: 150,
          isPublished: true,
          lessons: {
            create: [
              {
                title: 'Scientific Method',
                content: 'Learn how scientists ask questions and find answers through experiments.',
                order: 1,
                points: 15,
                duration: 40,
                isPublished: true,
              },
              {
                title: 'Properties of Matter',
                content: 'Explore the different states of matter and their properties.',
                order: 2,
                points: 20,
                duration: 45,
                isPublished: true,
              },
              {
                title: 'Simple Machines',
                content: 'Understand how simple machines make work easier in our daily lives.',
                order: 3,
                points: 25,
                duration: 35,
                isPublished: true,
              },
              {
                title: 'Plants and Animals',
                content: 'Learn about living things and their needs for survival.',
                order: 4,
                points: 18,
                duration: 30,
                isPublished: true,
              },
            ],
          },
        },
      }),
    ]);

    console.log('✅ Created sample courses with lessons');

    // Create a demo user
    const hashedPassword = await AuthUtils.hashPassword('Demo123!');
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@funedu.com',
        password: hashedPassword,
        name: 'Demo Student',
        class: '6th Grade',
        contact: '+1234567890',
        organization: 'Demo School',
        isEmailVerified: true,
        userStats: {
          create: {
            totalLectures: 10, // Total lessons across all courses
            completedLectures: 3,
            totalPoints: 45,
            currentLevel: 2,
            pointsToNextLevel: 455,
            streakDays: 5,
            lastActivityDate: new Date(),
          },
        },
      },
    });

    // Enroll demo user in courses
    await Promise.all([
      prisma.enrollment.create({
        data: {
          userId: demoUser.id,
          courseId: courses[0].id,
          progress: 66.67, // 2 out of 3 lessons completed
          lastAccessed: new Date(),
        },
      }),
      prisma.enrollment.create({
        data: {
          userId: demoUser.id,
          courseId: courses[1].id,
          progress: 33.33, // 1 out of 3 lessons completed
          lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        },
      }),
    ]);

    // Create some activities for the demo user
    const mathLessons = await prisma.lesson.findMany({
      where: { courseId: courses[0].id },
      take: 2,
    });

    const writingLessons = await prisma.lesson.findMany({
      where: { courseId: courses[1].id },
      take: 1,
    });

    await Promise.all([
      ...mathLessons.map((lesson: any, index: number) =>
        prisma.activity.create({
          data: {
            userId: demoUser.id,
            lessonId: lesson.id,
            type: 'LESSON',
            title: `Completed: ${lesson.title}`,
            points: lesson.points,
            isCompleted: true,
            completedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
          },
        })
      ),
      ...writingLessons.map((lesson: any) =>
        prisma.activity.create({
          data: {
            userId: demoUser.id,
            lessonId: lesson.id,
            type: 'LESSON',
            title: `Completed: ${lesson.title}`,
            points: lesson.points,
            isCompleted: true,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        })
      ),
    ]);

    // Create some game scores
    await Promise.all([
      prisma.gameScore.create({
        data: {
          userId: demoUser.id,
          gameId: games[0].id,
          score: 85,
          points: 43,
          playedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.gameScore.create({
        data: {
          userId: demoUser.id,
          gameId: games[1].id,
          score: 92,
          points: 69,
          playedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    // Create some achievements
    await Promise.all([
      prisma.achievement.create({
        data: {
          userId: demoUser.id,
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎉',
          points: 5,
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.achievement.create({
        data: {
          userId: demoUser.id,
          title: 'Math Enthusiast',
          description: 'Complete 2 math lessons',
          icon: '🔢',
          points: 10,
          unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    console.log('✅ Created demo user with progress data');
    console.log('📧 Demo credentials: demo@funedu.com / Demo123!');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });