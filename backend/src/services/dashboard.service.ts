import { User, UserStats, Activity, Achievement, Enrollment, Course } from '../types/prisma';
import prisma from '../config/database';
import logger from '../utils/logger';

export class DashboardService {
  /**
   * Get user dashboard overview
   */
  static async getDashboardOverview(userId: string) {
    try {
      const [userStats, recentActivities, achievements, enrollments] = await Promise.all([
        this.getUserStats(userId),
        this.getRecentActivities(userId, 5),
        this.getUserAchievements(userId),
        this.getUserEnrollments(userId)
      ]);

      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.progress === 100).length;
      const inProgressCourses = totalCourses - completedCourses;

      return {
        userStats,
        recentActivities,
        achievements,
        courseStats: {
          total: totalCourses,
          completed: completedCourses,
          inProgress: inProgressCourses
        },
        enrollments: enrollments.slice(0, 3) // Show only top 3
      };
    } catch (error) {
      logger.error('Error getting dashboard overview:', error);
      throw new Error('Failed to get dashboard overview');
    }
  }

  /**
   * Get or create user statistics
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    let userStats = await prisma.userStats.findUnique({
      where: { userId }
    });

    if (!userStats) {
      userStats = await prisma.userStats.create({
        data: {
          userId,
          totalLectures: 0,
          completedLectures: 0,
          totalPoints: 0,
          currentLevel: 1,
          pointsToNextLevel: 500,
          streakDays: 0,
          lastActivityDate: new Date()
        }
      });
    }

    return userStats as UserStats;
  }

  /**
   * Get recent activities for user
   */
  static async getRecentActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return activities as Activity[];
  }

  /**
   * Get user achievements
   */
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    });

    return achievements as Achievement[];
  }

  /**
   * Get user course enrollments with progress
   */
  static async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true
      }
    });

    return enrollments as (Enrollment & { course: Course })[];
  }

  /**
   * Update user statistics after completing an activity
   */
  static async updateUserStats(userId: string, points: number, activityType: 'lesson' | 'quiz' | 'game') {
    try {
      const userStats = await prisma.userStats.findUnique({
        where: { userId }
      });

      if (!userStats) {
        await prisma.userStats.create({
          data: {
            userId,
            totalLectures: activityType === 'lesson' ? 1 : 0,
            completedLectures: activityType === 'lesson' ? 1 : 0,
            totalPoints: points,
            currentLevel: 1,
            pointsToNextLevel: Math.max(500 - points, 0),
            streakDays: 1,
            lastActivityDate: new Date()
          }
        });
        return;
      }

      const newTotalPoints = userStats.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 500) + 1;
      const pointsToNextLevel = Math.max((newLevel * 500) - newTotalPoints, 0);

      await prisma.userStats.update({
        where: { userId },
        data: {
          totalLectures: activityType === 'lesson' ? userStats.totalLectures + 1 : userStats.totalLectures,
          completedLectures: activityType === 'lesson' ? userStats.completedLectures + 1 : userStats.completedLectures,
          totalPoints: newTotalPoints,
          currentLevel: newLevel,
          pointsToNextLevel,
          lastActivityDate: new Date()
        }
      });

    } catch (error) {
      logger.error('Error updating user stats:', error);
      throw new Error('Failed to update user statistics');
    }
  }
}