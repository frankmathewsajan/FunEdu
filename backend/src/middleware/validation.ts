import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseUtils } from '../utils/helpers';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
      res.status(400).json(ResponseUtils.validationError('Validation failed', errorMessage));
      return;
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
      res.status(400).json(ResponseUtils.validationError('Query validation failed', errorMessage));
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(50).required(),
    class: Joi.string().max(20).optional(),
    contact: Joi.string().max(20).optional(),
    organization: Joi.string().max(100).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    class: Joi.string().max(20).optional(),
    contact: Joi.string().max(20).optional(),
    organization: Joi.string().max(100).optional(),
    profilePicture: Joi.string().uri().optional(),
  }),

  // Course schemas
  courseQuery: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string().optional(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
    search: Joi.string().optional(),
  }),

  enrollment: Joi.object({
    courseId: Joi.string().required(),
  }),

  // Game score schema
  gameScore: Joi.object({
    gameId: Joi.string().required(),
    score: Joi.number().integer().min(0).required(),
  }),

  // Activity query schema
  activityQuery: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    type: Joi.string().valid('LESSON', 'ASSIGNMENT', 'QUIZ', 'PROJECT', 'READING').optional(),
    completed: Joi.boolean().optional(),
  }),
};