import { ApiResponse } from '../types';

export class ResponseUtils {
  /**
   * Create a success response
   */
  static success<T>(message: string, data?: T, pagination?: any): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }

  /**
   * Create an error response
   */
  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }

  /**
   * Create a validation error response
   */
  static validationError(message: string, errors?: any): ApiResponse {
    return {
      success: false,
      message,
      error: errors,
    };
  }
}

export class PaginationUtils {
  /**
   * Calculate pagination metadata
   */
  static getPaginationMeta(page: number, limit: number, total: number) {
    const pages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get skip value for database queries
   */
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Validate and sanitize pagination parameters
   */
  static validatePagination(page?: number, limit?: number) {
    const validatedPage = Math.max(1, page || 1);
    const validatedLimit = Math.min(100, Math.max(1, limit || 10));
    return { page: validatedPage, limit: validatedLimit };
  }
}

export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

export default {
  ResponseUtils,
  PaginationUtils,
  ValidationUtils,
};