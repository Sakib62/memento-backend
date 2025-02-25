import { NextFunction, Request, Response } from 'express';
import CreateUserDTO from '../dtos/createUserDTO';
import AuthService from '../services/authService';
import UserService from '../services/userService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user: CreateUserDTO = req.body;
    if (!user.username || !user.name || !user.email || !user.password) {
      next(new ValidationError());
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      next(new ValidationError('Invalid email format.'));
      return;
    }

    if (user.password.length < 6) {
      next(new ValidationError('Password must be at least 6 characters.'));
      return;
    }

    try {
      const newUser = await UserService.createUser(user);
      ResponseModel.send(res, HttpStatus.CREATED, newUser);
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { identifier, password } = req.body;
      const token = await AuthService.login(identifier, password);
      ResponseModel.send(res, HttpStatus.OK, { token });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
