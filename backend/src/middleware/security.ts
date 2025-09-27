import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '../config';
import logger from '../utils/logger';
import { ResponseUtils } from '../utils/helpers';

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: ResponseUtils.error('Too many requests, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: ResponseUtils.error('Too many authentication attempts, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
export const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Request logging
export const requestLogger = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error: ${error.message}\nStack: ${error.stack}`);

  // Joi validation error
  if (error.isJoi) {
    res.status(400).json(ResponseUtils.validationError('Validation failed', error.details));
    return;
  }

  // JWT error
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json(ResponseUtils.error('Invalid token'));
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json(ResponseUtils.error('Token expired'));
    return;
  }

  // Prisma errors
  if (error.code === 'P2002') {
    res.status(409).json(ResponseUtils.error('Resource already exists'));
    return;
  }

  if (error.code === 'P2025') {
    res.status(404).json(ResponseUtils.error('Resource not found'));
    return;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(statusCode).json(ResponseUtils.error(message));
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(ResponseUtils.error(`Route ${req.method} ${req.path} not found`));
};