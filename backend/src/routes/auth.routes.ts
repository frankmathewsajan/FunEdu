import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { authRateLimiter } from '../middleware/security';
import { schemas } from '../middleware/validation';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, validateRequest(schemas.register), AuthController.register);
router.post('/login', authRateLimiter, validateRequest(schemas.login), AuthController.login);
router.post('/forgot-password', authRateLimiter, validateRequest(schemas.forgotPassword), AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, validateRequest(schemas.resetPassword), AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.use(authenticate);

router.get('/profile', AuthController.getProfile);
router.put('/profile', validateRequest(schemas.updateProfile), AuthController.updateProfile);
router.put('/change-password', validateRequest(schemas.changePassword), AuthController.changePassword);
router.post('/logout', AuthController.logout);

export default router;