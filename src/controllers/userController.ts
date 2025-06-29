import { NextFunction, Request, Response } from 'express';
import UpdateUserDTO from '../dtos/updateUserDTO';
import { AuthRequest } from '../middlewares/authMiddleware';
import CommentService from '../services/commentService';
import LikeService from '../services/likeService';
import StoryService from '../services/storyService';
import UserService from '../services/userService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class UserController {
  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const DEFAULT_LIMIT = 10;
      const MAX_LIMIT = 100;
      const DEFAULT_OFFSET = 0;
      const MAX_OFFSET = 1000;
      const limit =
        req.query.limit !== undefined ? Number(req.query.limit) : DEFAULT_LIMIT;
      const offset =
        req.query.offset !== undefined
          ? Number(req.query.offset)
          : DEFAULT_OFFSET;
      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new ValidationError(
          `Limit must be a positive integer between 1 and ${MAX_LIMIT}.`
        );
      }
      if (!Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET) {
        throw new ValidationError(
          `Offset must be a integer between 0 and ${MAX_OFFSET}.`
        );
      }
      const users = await UserService.getAllUsers(limit, offset);
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
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);
      ResponseModel.send(res, HttpStatus.OK, user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserByUsername(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const username = req.params.username;
      const user = await UserService.getUserByUsername(username);

      const includeCounts = req.query.storyCount === 'true';
      const loggedInUser = req.user;

      if (!includeCounts) {
        ResponseModel.send(res, HttpStatus.OK, user);
        return;
      }

      const createdCount = await StoryService.countUserStories(user.id);
      let likedCount: number | undefined = undefined;
      let commentedCount: number | undefined = undefined;

      const isOwner = loggedInUser?.id === user.id;
      const isAdmin = loggedInUser?.role === 1;

      if (loggedInUser) {
        likedCount = await LikeService.countUserLikes(user.id);
      }
      if (isOwner || isAdmin) {
        commentedCount = await CommentService.countUserComments(user.id);
      }

      ResponseModel.send(res, HttpStatus.OK, {
        ...user,
        createdCount,
        ...(likedCount !== undefined && { likedCount }),
        ...(commentedCount !== undefined && { commentedCount }),
      });
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
      const userId = req.params.id;
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
      const userId = req.params.id;
      await UserService.deleteUser(userId);
      ResponseModel.send(res, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
