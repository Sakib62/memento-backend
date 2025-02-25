import { Response } from 'express';
import StoryController from '../../controllers/storyController';
import { AuthRequest } from '../../middlewares/authMiddleware';
import StoryService from '../../services/storyService';
import { ValidationError } from '../../utils/errorClass';
import { HttpStatus } from '../../utils/httpStatus';
import ResponseModel from '../../utils/responseModel';

jest.mock('../../services/storyService');
jest.mock('../../utils/responseModel', () => ({
  send: jest.fn(),
}));

describe('StoryController', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('createStory - should create a story and return it', async () => {
    req.body = {
      title: 'Story 1',
      description: 'Desc',
    };

    req.user = { username: 'User1', name: 'User', role: 1 };

    const mockStory = {
      id: 1,
      title: 'Story 1',
      description: 'Desc',
      authorUsername: 'user1',
      authorName: 'User',
    };
    (StoryService.createStory as jest.Mock).mockResolvedValue(mockStory);

    await StoryController.createStory(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.createStory).toHaveBeenCalledWith({
      ...req.body,
      authorUsername: req.user.username,
      authorName: req.user.name,
    });
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.CREATED,
      mockStory
    );
  });

  test('createStory - should call next with ValidationError if fields are missing', async () => {
    req.body = { title: '', description: '' };
    await StoryController.createStory(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(new ValidationError());
  });

  test('getAllStories - should return all stories with pagination', async () => {
    req.query = { limit: '10', offset: '0' };

    const mockStories = [{ id: 1, title: 'Story 1', description: 'Desc' }];
    (StoryService.getAllStories as jest.Mock).mockResolvedValue(mockStories);

    await StoryController.getAllStories(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.getAllStories).toHaveBeenCalledWith(10, 0);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockStories
    );
  });

  test('getAllStories - should return ValidationError if limit is invalid', async () => {
    req.query = { limit: '-1', offset: '0' };
    await StoryController.getAllStories(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      new ValidationError('Limit must be a positive integer between 1 and 100.')
    );
  });

  test('getAllStories - should return ValidationError if offset is invalid', async () => {
    req.query = { limit: '10', offset: '1001' };
    await StoryController.getAllStories(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      new ValidationError('Offset must be a integer between 0 and 1000.')
    );
  });

  test('getStoryById - should return story by ID', async () => {
    req.params = { id: '1' };

    const mockStory = { id: 1, title: 'Story 1', description: 'Desc' };
    (StoryService.getStoryById as jest.Mock).mockResolvedValue(mockStory);

    await StoryController.getStoryById(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.getStoryById).toHaveBeenCalledWith(1);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockStory
    );
  });

  test('getStoriesByAuthorUsername - should return stories by author username', async () => {
    req.params = { username: 'user1' };

    const mockStories = [
      { id: 1, title: 'Story 1', description: 'Desc', authorUsername: 'user1' },
      { id: 2, title: 'Story 2', description: 'Desc', authorUsername: 'user1' },
    ];

    (StoryService.getStoriesByAuthorUsername as jest.Mock).mockResolvedValue(
      mockStories
    );

    await StoryController.getStoriesByAuthorUsername(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.getStoriesByAuthorUsername).toHaveBeenCalledWith(
      'user1'
    );
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockStories
    );
  });

  test('updateStory - should update story and return it', async () => {
    req.params = { id: '1' };
    req.body = { title: 'Updated Story', description: 'Updated Desc' };

    const mockUpdatedStory = {
      id: 1,
      title: 'Updated Story',
      description: 'Updated Desc',
    };
    (StoryService.updateStory as jest.Mock).mockResolvedValue(mockUpdatedStory);

    await StoryController.updateStory(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.updateStory).toHaveBeenCalledWith(1, req.body);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockUpdatedStory
    );
  });

  test('deleteStory - should delete story and return success', async () => {
    req.params = { id: '1' };
    (StoryService.deleteStory as jest.Mock).mockResolvedValue(true);

    await StoryController.deleteStory(
      req as AuthRequest,
      res as Response,
      next
    );

    expect(StoryService.deleteStory).toHaveBeenCalledWith(1);
    expect(ResponseModel.send).toHaveBeenCalledWith(res, HttpStatus.OK);
  });
});
