import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    throw new AppError('Validation failed', 400);
  };
};

// Common validation patterns
export const commonValidations = {
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Please provide a valid email address'
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  },
  required: {
    notEmpty: true,
    errorMessage: 'This field is required'
  }
}; 