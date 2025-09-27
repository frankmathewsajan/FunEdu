import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { DashboardService } from '@/services/dashboard.service';
import { ResponseUtils } from '../utils/helpers';

export class DashboardController {
  /**
   * Get user dashboard data
   */
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const dashboard = await DashboardService.getDashboardOverview(req.user.id);
      
      res.json(
        ResponseUtils.success('Dashboard data retrieved successfully', dashboard)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const stats = await DashboardService.getUserStats(req.user.id);
      
      res.json(
        ResponseUtils.success('User statistics retrieved successfully', stats)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const activities = await DashboardService.getRecentActivities(req.user.id);
      
      res.json(
        ResponseUtils.success('Recent activities retrieved successfully', activities)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get achievements
   */
  static async getAchievements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const achievements = await DashboardService.getUserAchievements(req.user.id);
      
      res.json(
        ResponseUtils.success('Achievements retrieved successfully', achievements)
      );
    } catch (error: any) {
      next(error);
    }
  }
}