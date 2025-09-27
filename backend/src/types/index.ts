import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  class?: string | null;
  contact?: string | null;
  organization?: string | null;
  isEmailVerified?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  headers: Request['headers'];
}

export interface JwtPayloadExtended extends JwtPayload {
  userId: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  class?: string;
  contact?: string;
  organization?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  class?: string;
  contact?: string;
  organization?: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CourseFilter extends PaginationParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

export interface ActivityFilter extends PaginationParams {
  type?: string;
  completed?: boolean;
}

export interface GameScoreRequest {
  gameId: string;
  score: number;
}

export interface EnrollmentRequest {
  courseId: string;
}