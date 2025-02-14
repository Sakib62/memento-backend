import { NextFunction, Response } from 'express';
import StoryService from '../services/storyService';
import UserService from '../services/userService';
import { ForbiddenError } from '../utils/errorClass';
import { AuthRequest } from './authMiddleware';

export const userRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  if (user.role == 1) {
    return next();
  }
  if (req.params.username) {
    if (user.username != req.params.username) {
      throw new ForbiddenError();
    }
  } else if (req.params.id) {
    try {
      const fetchedUser = await UserService.getUserById(
        parseInt(req.params.id, 10)
      );
      if (!fetchedUser || user.username != fetchedUser.username) {
        throw new ForbiddenError();
      }
    } catch (error) {
      next(error);
      return;
    }
  }
  return next();
};

export const storyRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  if (user.role == 1) {
    return next();
  }
  try {
    const fetchedStory = await StoryService.getStoryById(
      parseInt(req.params.id, 10)
    );
    if (!fetchedStory || user.username != fetchedStory.authorUsername) {
      throw new ForbiddenError();
    }
    return next();
  } catch (error) {
    next(error);
  }
};
