import prisma from '../config/database';
import { DashboardService } from '@/services/dashboard.service';
import logger from '../utils/logger';

export class GameService {
  /**
   * Get all active games
   */
  static async getAllGames() {
    return prisma.game.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get game by ID
   */
  static async getGameById(gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (!game.isActive) {
      throw new Error('Game is not active');
    }

    return game;
  }

  /**
   * Submit game score
   */
  static async submitScore(userId: string, gameId: string, score: number) {
    // Verify game exists and is active
    const game = await GameService.getGameById(gameId);

    // Calculate points based on score and game difficulty
    let points = Math.floor(score * 0.1); // Base calculation
    
    if (game.difficulty === 'medium') {
      points = Math.floor(points * 1.5);
    } else if (game.difficulty === 'hard') {
      points = Math.floor(points * 2);
    }

    // Cap points at game's max points
    points = Math.min(points, game.maxPoints);

    // Create game score record
    const gameScore = await prisma.gameScore.create({
      data: {
        userId,
        gameId,
        score,
        points,
      },
    });

    // Update user stats with earned points
    await DashboardService.updateUserStats(userId, points, 'game');

    // Create activity record
    await prisma.activity.create({
      data: {
        userId,
        type: 'ASSIGNMENT',
        title: `Played: ${game.title}`,
        description: `Score: ${score}, Points earned: ${points}`,
        points,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    logger.info(`User ${userId} scored ${score} in game ${gameId}, earned ${points} points`);

    return {
      gameScore,
      pointsEarned: points,
      newScore: score,
    };
  }

  /**
   * Get user's game statistics
   */
  static async getUserGameStats(userId: string) {
    const gameStats = await prisma.gameScore.groupBy({
      by: ['gameId'],
      where: { userId },
      _count: { id: true },
      _max: { score: true },
      _sum: { points: true },
    });

    const gamesWithStats = await Promise.all(
      gameStats.map(async (stat: any) => {
        const game = await prisma.game.findUnique({
          where: { id: stat.gameId },
          select: { id: true, title: true, icon: true, difficulty: true },
        });

        return {
          game,
          gamesPlayed: stat._count.id,
          bestScore: stat._max.score,
          totalPointsEarned: stat._sum.points,
        };
      })
    );

    const totalStats = await prisma.gameScore.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { points: true },
    });

    return {
      games: gamesWithStats,
      totalGamesPlayed: totalStats._count.id,
      totalPointsFromGames: totalStats._sum.points || 0,
    };
  }

  /**
   * Get leaderboard for a specific game
   */
  static async getLeaderboard(gameId: string, limit: number = 10) {
    // Verify game exists
    await GameService.getGameById(gameId);

    const leaderboard = await prisma.gameScore.findMany({
      where: { gameId },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      distinct: ['userId'], // Get best score per user
    });

    return leaderboard.map((entry: any, index: number) => ({
      rank: index + 1,
      user: entry.user,
      score: entry.score,
      points: entry.points,
      playedAt: entry.playedAt,
    }));
  }

  /**
   * Get user's rank in a specific game
   */
  static async getUserRank(userId: string, gameId: string) {
    const userBestScore = await prisma.gameScore.findFirst({
      where: { userId, gameId },
      orderBy: { score: 'desc' },
    });

    if (!userBestScore) {
      return null;
    }

    const betterScores = await prisma.gameScore.groupBy({
      by: ['userId'],
      where: {
        gameId,
        score: { gt: userBestScore.score },
      },
    });

    return {
      rank: betterScores.length + 1,
      score: userBestScore.score,
      points: userBestScore.points,
    };
  }

  /**
   * Create initial games (seed data)
   */
  static async createInitialGames() {
    const existingGames = await prisma.game.count();
    
    if (existingGames > 0) {
      return; // Games already exist
    }

    const initialGames = [
      {
        title: 'Math Quiz Game',
        description: 'Test your math skills with fun arithmetic questions',
        icon: '🧮',
        difficulty: 'easy',
        maxPoints: 50,
      },
      {
        title: 'Word Puzzle',
        description: 'Solve word puzzles and expand your vocabulary',
        icon: '🧩',
        difficulty: 'medium',
        maxPoints: 75,
      },
      {
        title: 'Science Challenge',
        description: 'Explore the world of science with challenging questions',
        icon: '🔬',
        difficulty: 'hard',
        maxPoints: 100,
      },
      {
        title: 'Geography Explorer',
        description: 'Discover countries, capitals, and landmarks around the world',
        icon: '🗺️',
        difficulty: 'medium',
        maxPoints: 80,
      },
      {
        title: 'History Timeline',
        description: 'Journey through time with historical events and figures',
        icon: '📚',
        difficulty: 'hard',
        maxPoints: 90,
      },
    ];

    await prisma.game.createMany({
      data: initialGames,
    });

    logger.info('Created initial games');
  }
}