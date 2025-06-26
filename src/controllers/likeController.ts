import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import LikeService from '../services/likeService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class LikeController {
  static async toggleLike(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const userId = req.user.id;
      const result = await LikeService.toggleLike(userId, storyId);
      ResponseModel.send(res, HttpStatus.CREATED, result);
    } catch (error) {
      next(error);
    }
  }

  static async getLikeCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const likeCount = await LikeService.getLikeCount(storyId);
      ResponseModel.send(res, HttpStatus.OK, { likeCount });
    } catch (error) {
      next(error);
    }
  }

  static async checkIfLiked(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const userId = req.user.id;
      const hasLiked = await LikeService.checkIfLiked(userId, storyId);
      ResponseModel.send(res, HttpStatus.OK, { hasLiked });
    } catch (error) {
      next(error);
    }
  }

  static async getStoryLikers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const likers = await LikeService.getStoryLikers(storyId);
      ResponseModel.send(res, HttpStatus.OK, { likers });
    } catch (error) {
      next(error);
    }
  }

  static async getLikeStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const userId = req.user.id;
      const likeStatus = await LikeService.getLikeStatus(userId, storyId);
      ResponseModel.send(res, HttpStatus.OK, likeStatus);
    } catch (error) {
      next(error);
    }
  }

  static async getLikedStoriesByUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const likedStories = await LikeService.getLikedStoriesByUser(userId);
      ResponseModel.send(res, HttpStatus.OK, likedStories);
    } catch (error) {
      next(error);
    }
  }

  static async getTopLikedStories(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const DEFAULT_OFFSET = 0;
      const DEFAULT_LIMIT = 10;
      const MAX_LIMIT = 100;

      const offset =
        req.query.offset !== undefined && !isNaN(Number(req.query.offset))
          ? Number(req.query.offset)
          : DEFAULT_OFFSET;

      if (!Number.isInteger(offset) || offset < 0) {
        throw new ValidationError(
          `Offset must be a positive integer starting from 0.`
        );
      }

      const limit =
        req.query.limit !== undefined && !isNaN(Number(req.query.limit))
          ? Number(req.query.limit)
          : DEFAULT_LIMIT;

      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new ValidationError(
          `Limit must be a positive integer between 1 and ${MAX_LIMIT}.`
        );
      }

      const stories = await LikeService.getTopLikedStories(offset, limit);
      ResponseModel.send(res, HttpStatus.OK, stories);
    } catch (error) {
      next(error);
    }
  }
}

export default LikeController;
