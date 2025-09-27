import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { GameService } from '../services/game.service';
import { ResponseUtils } from '../utils/helpers';

export class GameController {
  /**
   * Get all available games
   */
  static async getGames(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const games = await GameService.getAllGames();
      
      res.json(
        ResponseUtils.success('Games retrieved successfully', games)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get game by ID
   */
  static async getGameById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameId } = req.params;
      const game = await GameService.getGameById(gameId);
      
      res.json(
        ResponseUtils.success('Game retrieved successfully', game)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Submit game score
   */
  static async submitScore(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const { gameId, score } = req.body;
      const result = await GameService.submitScore(req.user.id, gameId, score);
      
      res.json(
        ResponseUtils.success('Score submitted successfully', result)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get user's game scores/statistics
   */
  static async getUserGameStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const stats = await GameService.getUserGameStats(req.user.id);
      
      res.json(
        ResponseUtils.success('Game statistics retrieved successfully', stats)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get leaderboard for a specific game
   */
  static async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameId } = req.params;
      const { limit = 10 } = req.query;
      
      const leaderboard = await GameService.getLeaderboard(gameId, Number(limit));
      
      res.json(
        ResponseUtils.success('Leaderboard retrieved successfully', leaderboard)
      );
    } catch (error: any) {
      next(error);
    }
  }
}