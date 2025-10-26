import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', optionalAuth, GameController.getGames);
router.get('/:gameId', optionalAuth, GameController.getGameById);
router.get('/:gameId/leaderboard', optionalAuth, GameController.getLeaderboard);

// Protected routes (require authentication)
router.post('/score', authenticate, validateRequest(schemas.gameScore), GameController.submitScore);
router.get('/stats/user', authenticate, GameController.getUserGameStats);

export default router;