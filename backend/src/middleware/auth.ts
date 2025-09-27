import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/helpers';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import logger from '../utils/logger';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers?.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json(ResponseUtils.error('Access token is required'));
      return;
    }

    const decoded = AuthUtils.verifyToken(token);
    
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        class: true,
        contact: true,
        organization: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      res.status(401).json(ResponseUtils.error('Invalid access token'));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(401).json(ResponseUtils.error('Invalid or expired access token'));
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers?.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = AuthUtils.verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          class: true,
          contact: true,
          organization: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Optional auth - continue even if token is invalid
    next();
  }
};