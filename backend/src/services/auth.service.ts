import { User, UserStats } from '../types/prisma';
import prisma from '../config/database';
import { AuthUtils } from '../utils/auth';
import { 
  RegisterRequest, 
  LoginRequest, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '../types';
import logger from '../utils/logger';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<{ user: User; token: string; refreshToken: string }> {
    const { email, password, name, class: userClass, contact, organization } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create user and user stats in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          class: userClass,
          contact,
          organization,
          emailVerificationToken: AuthUtils.generateRandomToken(),
        },
      });

      // Create initial user stats
      await tx.userStats.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    // Generate tokens
    const tokenPayload = { userId: result.id, email: result.email };
    const token = AuthUtils.generateToken(tokenPayload);
    const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

    logger.info(`User registered: ${email}`);

    return { user: result, token, refreshToken };
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<{ user: User; token: string; refreshToken: string }> {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const token = AuthUtils.generateToken(tokenPayload);
    const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

    logger.info(`User logged in: ${email}`);

    return { user, token, refreshToken };
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<User & { userStats: UserStats | null }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userStats: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: UpdateProfileRequest): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    logger.info(`Profile updated for user: ${user.email}`);

    return user;
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    const { currentPassword, newPassword } = data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthUtils.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await AuthUtils.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    logger.info(`Password changed for user: ${user.email}`);
  }

  /**
   * Forgot password - generate reset token
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = AuthUtils.generateRandomToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // TODO: Send email with reset token
    logger.info(`Password reset requested for user: ${email}`);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const { token, newPassword } = data;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await AuthUtils.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      },
    });

    logger.info(`Password reset completed for user: ${user.email}`);
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = AuthUtils.verifyRefreshToken(refreshToken);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const tokenPayload = { userId: user.id, email: user.email };
      const newToken = AuthUtils.generateToken(tokenPayload);
      const newRefreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}