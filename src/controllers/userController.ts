import { Request, Response } from 'express';
import User from '../database/models/userModel';
import UserService from '../services/userService';
import ResponseModel from '../utils/responseModel';

class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    const { password, ...user } = req.body;
    if (!user.username || !user.name || !user.email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    try {
      const newUser = await UserService.createUser(user, password);
      ResponseModel.send(res, 201, newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      ResponseModel.send(res, 200, users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(userId);
      if (user) {
        ResponseModel.send(res, 200, user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;
      const user = await UserService.getUserByUsername(username);
      if (user) {
        ResponseModel.send(res, 200, user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const userUpdates: Partial<User> = req.body;
      const updatedUser = await UserService.updateUser(userId, userUpdates);
      if (updatedUser) {
        ResponseModel.send(res, 200, updatedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const isDeleted = await UserService.deleteUser(userId);
      if (isDeleted) {
        ResponseModel.send(res, 200);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
