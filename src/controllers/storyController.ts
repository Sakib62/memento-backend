import { NextFunction, Response } from 'express';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import { AuthRequest } from '../middlewares/authMiddleware';
import StoryService from '../services/storyService';
import { ValidationError } from '../utils/errorClass';
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
        authorUsername: user.username,
        authorName: user.name,
        tags: tags || [],
      };
      const newStory = await StoryService.createStory(storyPayload);
      ResponseModel.send(res, HttpStatus.CREATED, newStory);
    } catch (error) {
      next(error);
    }
  }

  static async getAllStories(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const DEFAULT_PAGE = 1;
      const DEFAULT_LIMIT = 10;
      const MAX_LIMIT = 100;

      const page =
        req.query.page !== undefined && !isNaN(Number(req.query.page))
          ? Number(req.query.page)
          : DEFAULT_PAGE;

      const limit =
        req.query.limit !== undefined && !isNaN(Number(req.query.limit))
          ? Number(req.query.limit)
          : DEFAULT_LIMIT;

      if (!Number.isInteger(page) || page < 1) {
        throw new ValidationError(
          `Page must be a positive integer starting from 1.`
        );
      }

      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new ValidationError(
          `Limit must be a positive integer between 1 and ${MAX_LIMIT}.`
        );
      }

      const stories = await StoryService.getAllStories(page, limit);
      ResponseModel.send(res, HttpStatus.OK, stories);
    } catch (error) {
      next(error);
    }
  }

  static async getStoryById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = req.params.id;
      const story = await StoryService.getStoryById(storyId);
      ResponseModel.send(res, HttpStatus.OK, story);
    } catch (error) {
      next(error);
    }
  }

  static async getStoriesByAuthorUsername(
    req: AuthRequest,
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
