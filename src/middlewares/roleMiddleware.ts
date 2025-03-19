import { NextFunction, Response } from 'express';
import CommentRepository from '../repositories/commentRepository';
import StoryService from '../services/storyService';
import UserService from '../services/userService';
import { ForbiddenError } from '../utils/errorClass';
import { AuthRequest } from './authMiddleware';

const Roles = {
  USER: 0,
  ADMIN: 1,
};

export const userRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  if (user.role === Roles.ADMIN) {
    return next();
  }
  const { username, id } = req.params;
  if (username && user.username !== username) {
    throw new ForbiddenError('You do not have permission for this action');
  } else if (id) {
    try {
      const fetchedUser = await UserService.getUserById(id);
      if (!fetchedUser || user.username !== fetchedUser.username) {
        throw new ForbiddenError('You do not have permission for this action');
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
  if (user.role === Roles.ADMIN) {
    return next();
  }
  try {
    const fetchedStory = await StoryService.getStoryById(req.params.id);
    if (!fetchedStory || user.username !== fetchedStory.authorUsername) {
      throw new ForbiddenError('You do not have permission for this action');
    }
    return next();
  } catch (error) {
    next(error);
    return;
  }
};

export const commentRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  const { id: commentId } = req.params;

  try {
    const fetchedComment = await CommentRepository.getCommentById(commentId);

    if (
      !fetchedComment ||
      (fetchedComment.userId !== user.id && user.role !== Roles.ADMIN)
    ) {
      throw new ForbiddenError('You do not have permission for this action');
    }

    return next();
  } catch (error) {
    next(error);
  }
};
