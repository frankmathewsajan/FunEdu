import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard routes
router.get('/', DashboardController.getDashboard);
router.get('/stats', DashboardController.getUserStats);
router.get('/activities', DashboardController.getRecentActivities);
router.get('/achievements', DashboardController.getAchievements);

export default router;