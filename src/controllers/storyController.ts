import { NextFunction, Request, Response } from 'express';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import StoryService from '../services/storyService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class StoryController {
  static async createStory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storyData: CreateStoryDTO = req.body;
    if (
      !storyData.title ||
      !storyData.description ||
      !storyData.authorUsername
    ) {
      next(new ValidationError());
      return;
    }
    try {
      const newStory = await StoryService.createStory(storyData);
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
          'Offset must be a integer between 0 and ${MAX_OFFSET}.'
        );
      }
      const stories = await StoryService.getAllStories(limit, offset);
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
      const storyId = parseInt(req.params.id, 10);
      const story = await StoryService.getStoryById(storyId);
      ResponseModel.send(res, HttpStatus.OK, story);
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = parseInt(req.params.id, 10);
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const storyId = parseInt(req.params.id, 10);
      await StoryService.deleteStory(storyId);
      ResponseModel.send(res, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default StoryController;
