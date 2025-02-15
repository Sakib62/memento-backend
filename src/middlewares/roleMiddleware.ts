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
  const isAdmin = user.role === 1;
  if (isAdmin) {
    return next();
  }
  const { username, id } = req.params;
  if (username) {
    if (user.username !== username) {
      throw new ForbiddenError();
    }
  } else if (id) {
    try {
      const fetchedUser = await UserService.getUserById(parseInt(id, 10));
      if (!fetchedUser || user.username !== fetchedUser.username) {
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
  const isAdmin = user.role === 1;
  if (isAdmin) {
    return next();
  }
  try {
    const fetchedStory = await StoryService.getStoryById(
      parseInt(req.params.id, 10)
    );
    if (!fetchedStory || user.username !== fetchedStory.authorUsername) {
      throw new ForbiddenError();
    }
    return next();
  } catch (error) {
    next(error);
    return;
  }
};
