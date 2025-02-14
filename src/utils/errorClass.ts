import { HttpStatus } from '../utils/httpStatus';

export class AppError extends Error {
  statusCode: number;
  status: 'fail' | 'error';

  constructor(message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Resource Not Found', HttpStatus.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message?: string) {
    super(message || 'Validation Failed', HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || 'Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || 'Permission denied', HttpStatus.FORBIDDEN);
  }
}
