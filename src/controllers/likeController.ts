import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import LikeRepository from '../repositories/likeRepository';
import LikeService from '../services/likeService';
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
      const likeCount = result.likeCount;
      ResponseModel.send(res, HttpStatus.OK, { likeCount });
    } catch (error) {
      next(error);
    }
  }

  static async getLikeCount(
    req: AuthRequest,
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

      const likeCount = await LikeRepository.getLikeCount(storyId);

      const likedByUser = await LikeRepository.checkIfLiked(userId, storyId);

      ResponseModel.send(res, HttpStatus.OK, {
        likeCount,
        likedByUser: !!likedByUser,
      });
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
}

export default LikeController;
