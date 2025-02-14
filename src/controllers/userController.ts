import { NextFunction, Request, Response } from 'express';
import CreateUserDTO from '../dtos/createUserDTO';
import UpdateUserDTO from '../dtos/updateUserDTO';
import UserService from '../services/userService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class UserController {
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

  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      ResponseModel.send(res, HttpStatus.OK, users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(userId);
      ResponseModel.send(res, HttpStatus.OK, user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const username = req.params.username;
      const user = await UserService.getUserByUsername(username);
      ResponseModel.send(res, HttpStatus.OK, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const userUpdates: Partial<UpdateUserDTO> = req.body;
      const updatedUser = await UserService.updateUser(userId, userUpdates);
      ResponseModel.send(res, HttpStatus.OK, updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      await UserService.deleteUser(userId);
      ResponseModel.send(res, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
