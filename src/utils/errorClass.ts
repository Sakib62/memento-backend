export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Resource Not Found', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message?: string) {
    super(message || 'Validation Failed', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || 'Unauthorized access', 401);
  }
}
