import express from 'express';
import cors from 'cors';
import { config } from './config';
import {
  rateLimiter,
  corsOptions,
  securityHeaders,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from './middleware/security';
import routes from './routes';
import logger from './utils/logger';
import prisma from './config/database';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(securityHeaders);
    
    // CORS
    this.app.use(cors(corsOptions));
    
    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logging
    this.app.use(requestLogger);
    
    // Rate limiting
    this.app.use(rateLimiter);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/v1', routes);
    
    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        name: config.app.name,
        version: config.app.version,
        status: 'running',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      await prisma.$connect();
      logger.info('Database connected successfully');

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`🚀 Server running on port ${config.port}`);
        logger.info(`📍 Environment: ${config.nodeEnv}`);
        logger.info(`🌐 API URL: http://localhost:${config.port}/api/v1`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
const app = new App();

process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());

export default app;