import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';
import { ValidationError } from '../utils/errorClass';
import UserService from '../services/userService';
import CreateUserDTO from '../dtos/createUserDTO';

class AuthController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user: CreateUserDTO = req.body;
    if (!user.username || !user.name || !user.email || !user.password) {
      next(new ValidationError());
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
