import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import CommentService from '../services/commentService';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class CommentController {
  static async createComment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const userId = req.user.id;
      const { comment } = req.body;
      const newComment = await CommentService.createComment(
        userId,
        storyId,
        comment
      );
      ResponseModel.send(res, HttpStatus.CREATED, newComment);
    } catch (error) {
      next(error);
    }
  }

  static async getCommentsForStory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const comments = await CommentService.getCommentsForStory(storyId);
      ResponseModel.send(res, HttpStatus.OK, comments);
    } catch (error) {
      next(error);
    }
  }

  static async editComment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commentId = req.params.id;
      const { comment } = req.body;
      const updatedComment = await CommentService.editComment(
        commentId,
        comment
      );
      ResponseModel.send(res, HttpStatus.OK, updatedComment);
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const commentId = req.params.id;
      const deletedComment = await CommentService.deleteComment(commentId);
      ResponseModel.send(res, HttpStatus.OK, deletedComment);
    } catch (error) {
      next(error);
    }
  }

  static async getCommentedStoriesByUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const commentedStories =
        await CommentService.getCommentedStoriesByUser(userId);
      ResponseModel.send(res, HttpStatus.OK, commentedStories);
    } catch (error) {
      next(error);
    }
  }

  static async getCommentCountByStory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const commentCount = await CommentService.getCommentCountByStory(storyId);
      ResponseModel.send(res, HttpStatus.OK, { commentCount });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;
