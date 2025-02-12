import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errorClass';

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export default errorHandler;
