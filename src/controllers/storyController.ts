import { NextFunction, Request, Response } from 'express';
import { validate } from 'uuid';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { AuthRequest } from '../middlewares/authMiddleware';
import StoryService from '../services/storyService';
import { NotFoundError, ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class StoryController {
  static async createStory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { title, description, tags }: CreateStoryDTO = req.body;
    if (!title || !description) {
      next(new ValidationError());
      return;
    }
    try {
      const user = req.user;
      const storyPayload = {
        title,
        description,
        authorId: user.id,
        tags: tags || [],
      };
      const newStory = await StoryService.createStory(storyPayload);
      ResponseModel.send(res, HttpStatus.CREATED, newStory);
    } catch (error) {
      next(error);
    }
  }

  static async getAllStories(
    req: Request,
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

      const filter = req.query.filter as string;

      const stories = await StoryService.getAllStories(offset, limit, filter);
      ResponseModel.send(res, HttpStatus.OK, stories);
    } catch (error) {
      next(error);
    }
  }

  static async getStoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      if (!validate(storyId)) {
        throw new NotFoundError('Story not found');
      }

      const story = await StoryService.getStoryById(storyId);
      ResponseModel.send(res, HttpStatus.OK, story);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getStoriesByAuthorUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const username = req.params.username;
      const stories = await StoryService.getStoriesByAuthorUsername(username);
      ResponseModel.send(res, HttpStatus.OK, stories);
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const storyUpdates: UpdateStoryDTO = req.body;
      const updatedStory = await StoryService.updateStory(
        storyId,
        storyUpdates
      );
      ResponseModel.send(res, HttpStatus.OK, updatedStory);
    } catch (error) {
      next(error);
    }
  }

  static async deleteStory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      await StoryService.deleteStory(storyId);
      ResponseModel.send(res, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default StoryController;
