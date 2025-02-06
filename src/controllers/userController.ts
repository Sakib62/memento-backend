import { Request, Response } from 'express';
import UserService from '../services/userService';
import User from '../database/models/userModel';
import ResponseModel from '../utils/responseModel';

class userController {
    static async createUser(req: Request, res: Response): Promise<void> {
        const { password, ...user } = req.body;
        if (!user.username || !user.name || !user.email || !password) {
            ResponseModel.send(res, 400, 'Missing required fields');
            return;
        }
        try {
            const newUser = await UserService.createUser(user, password);
            ResponseModel.send(res, 201, 'User created successfully', newUser);
        }
        catch (error) {
            ResponseModel.send(res, 500, error.message);
        }
    }

    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();
            ResponseModel.send(res, 200, 'Users fetched successfully', users);
        }
        catch(error) {
            ResponseModel.send(res, 500, error.message);
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await UserService.getUserById(userId);
            if (user) {
                ResponseModel.send(res, 200, 'User found', user);
            }
            else {
                ResponseModel.send(res, 404, 'User not found');
            }
        }
        catch(error) {
            ResponseModel.send(res, 500, error.message);
        }
    }

    static async getUserByUsername(req: Request, res: Response): Promise<void> {
        try {
            const username = req.params.username;
            const user = await UserService.getUserByUsername(username);
            if (user) {
                ResponseModel.send(res, 200, 'User found', user);
            }
            else {
                ResponseModel.send(res, 404, 'User not found');
            }
        }
        catch(error) {
            ResponseModel.send(res, 500, error.message);
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const userUpdates: Partial<User> = req.body;
            const updatedUser = await UserService.updateUser(userId, userUpdates);
            if (updatedUser) {
                ResponseModel.send(res, 200, 'User updated successfully', updatedUser);
            }
            else {
                ResponseModel.send(res, 404, 'User not found');
            }
        }
        catch(error) {
            ResponseModel.send(res, 500, error.message);
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const isDeleted = await UserService.deleteUser(userId);
            if (isDeleted) {
                ResponseModel.send(res, 200, 'User deleted successfully');
            }
            else {
                ResponseModel.send(res, 404, 'User not found');
            }
        }
        catch(error) {
            ResponseModel.send(res, 500, error.message);
        }
    }
}

export default userController;
