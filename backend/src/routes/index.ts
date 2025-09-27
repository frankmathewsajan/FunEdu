import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import dashboardRoutes from './dashboard.routes';
import gameRoutes from './game.routes';
import { ResponseUtils } from '../utils/helpers';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json(ResponseUtils.success('API is running'));
});

// API routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/games', gameRoutes);

export default router;