import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest, validateQuery } from '../middleware/validation';
import { schemas } from '../middleware/validation';

const router = Router();

// Public routes (with optional auth for enrollment status)
router.get('/', optionalAuth, validateQuery(schemas.courseQuery), CourseController.getCourses);
router.get('/categories', CourseController.getCategories);
router.get('/:courseId', optionalAuth, CourseController.getCourseById);

// Protected routes
router.use(authenticate);

router.post('/enroll', validateRequest(schemas.enrollment), CourseController.enrollInCourse);
router.get('/user/enrollments', validateQuery(schemas.courseQuery), CourseController.getUserEnrollments);
router.put('/:courseId/lessons/:lessonId/complete', CourseController.updateProgress);

export default router;