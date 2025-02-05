import { Request, Response } from 'express';
import UserService from '../services/userService';
import User from '../database/models/userModel';

class userController {
    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: User = req.body;
            const newUser = await UserService.createUser(user);
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        }
        catch(error) {
            res.status(500).json({message: error.message});
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await UserService.getUserById(userId);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({message: 'User not found'});
            }
        }
        catch(error) {
            res.status(500).json({message: error.message});
        }
    }

    static async getUserByUsername(req: Request, res: Response): Promise<void> {
        try {
            const username = req.params.username;
            const user = await UserService.getUserByUsername(username);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({message: 'User not found'});
            }
        }
        catch(error) {
            res.status(500).json({message: error.message});
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const userUpdates: Partial<User> = req.body;
            const updatedUser = await UserService.updateUser(userId, userUpdates);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            }
            else {
                res.status(404).json({messgae: 'User not found'});
            }
        }
        catch(error) {
            res.status(500).json({message: error.message});
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const isDeleted = await UserService.deleteUser(userId);
            if (isDeleted) {
                res.status(200).json({message: 'User deleted successfully'});
            }
            else {
                res.status(404).json({message: 'User not found'});
            }
        }
        catch(error) {
            res.status(500).json({message: error.message});
        }
    }
}

export default userController;
