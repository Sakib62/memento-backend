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
      const stories = await StoryService.getAllStories();
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
    const storyId = parseInt(req.params.id, 10);
    try {
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
    const storyId = parseInt(req.params.id, 10);
    const storyUpdates: UpdateStoryDTO = req.body;
    try {
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
    const storyId = parseInt(req.params.id, 10);
    try {
      await StoryService.deleteStory(storyId);
      ResponseModel.send(res, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  }
}

export default StoryController;
