import { NextFunction, Request, Response } from 'express';
import User from '../database/models/userModel';
import UserService from '../services/userService';
import { NotFoundError, ValidationError } from '../utils/errorClass';
import ResponseModel from '../utils/responseModel';

class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { password, ...user } = req.body;
    if (!user.username || !user.name || !user.email || !password) {
      next(new ValidationError());
      return;
    }
    try {
      const newUser = await UserService.createUser(user, password);
      ResponseModel.send(res, 201, newUser);
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
      ResponseModel.send(res, 200, users);
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
      if (user) {
        ResponseModel.send(res, 200, user);
      } else {
        next(new NotFoundError());
      }
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
      if (user) {
        ResponseModel.send(res, 200, user);
      } else {
        next(new NotFoundError());
      }
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
      const userUpdates: Partial<User> = req.body;
      const updatedUser = await UserService.updateUser(userId, userUpdates);
      if (updatedUser) {
        ResponseModel.send(res, 200, updatedUser);
      } else {
        next(new NotFoundError());
      }
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
      const isDeleted = await UserService.deleteUser(userId);
      if (isDeleted) {
        ResponseModel.send(res, 200);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
