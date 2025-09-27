import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';
import { ResponseUtils } from '../utils/helpers';
import logger from '../utils/logger';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = result.user;
      
      res.status(201).json(
        ResponseUtils.success('User registered successfully', {
          user: userWithoutPassword,
          token: result.token,
          refreshToken: result.refreshToken,
        })
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = result.user;
      
      res.json(
        ResponseUtils.success('Login successful', {
          user: userWithoutPassword,
          token: result.token,
          refreshToken: result.refreshToken,
        })
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const user = await AuthService.getProfile(req.user.id);
      
      // Don't send password in response
      const { password, emailVerificationToken, resetPasswordToken, ...userWithoutSensitiveData } = user;
      
      res.json(
        ResponseUtils.success('Profile retrieved successfully', userWithoutSensitiveData)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      const user = await AuthService.updateProfile(req.user.id, req.body);
      
      // Don't send password in response
      const { password, emailVerificationToken, resetPasswordToken, ...userWithoutSensitiveData } = user;
      
      res.json(
        ResponseUtils.success('Profile updated successfully', userWithoutSensitiveData)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      await AuthService.changePassword(req.user.id, req.body);
      
      res.json(ResponseUtils.success('Password changed successfully'));
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.forgotPassword(req.body);
      
      res.json(ResponseUtils.success('If the email exists, a password reset link has been sent'));
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.resetPassword(req.body);
      
      res.json(ResponseUtils.success('Password reset successfully'));
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json(ResponseUtils.error('Refresh token is required'));
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);
      
      res.json(
        ResponseUtils.success('Token refreshed successfully', result)
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Logout user (client-side only for JWT)
   */
  static async logout(req: AuthRequest, res: Response): Promise<void> {
    // With JWT, logout is primarily client-side by removing the token
    // Server-side logout would require token blacklisting which adds complexity
    res.json(ResponseUtils.success('Logged out successfully'));
  }
}