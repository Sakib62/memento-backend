import Story from '../database/models/storyModel';
import { UpdateStoryDTO } from '../dtos/storyDTO';
import LikeRepository from '../repositories/likeRepository';
import StoryRepository from '../repositories/storyRepository';
import { NotFoundError } from '../utils/errorClass';
import CommentService from './commentService';
import LikesService from './likeService';
import UserService from './userService';

class StoryService {
  static async createStory(storyPayload: Partial<Story>): Promise<Story> {
    const newStory = await StoryRepository.createStory(storyPayload);
    return newStory;
  }

  static async getAllStories(
    offset: number,
    limit: number,
    filter?: string
  ): Promise<Story[]> {
    let stories;

    if (filter === 'mostLiked') {
      stories = await LikeRepository.getTopLikedStories(offset, limit);
    } else {
      stories = await StoryRepository.getAllStories(offset, limit);
    }

    const enrichedStories = await Promise.all(
      stories.map(async (story) => {
        const likeCount = await LikesService.getLikeCount(story.id);
        const commentCount = await CommentService.getCommentCountByStory(
          story.id
        );

        return {
          ...story,
          likeCount,
          commentCount,
        };
      })
    );

    return enrichedStories;
  }

  static async getStoryById(storyId: string): Promise<Story | null> {
    const story = await StoryRepository.getStoryById(storyId);
    if (!story) {
      throw new NotFoundError('Story not found');
    }
    return story;
  }

  static async getStoriesByAuthorUsername(
    username: string
  ): Promise<Story[] | null> {
    const user = await UserService.getUserByUsername(username);
    const stories = await StoryRepository.getStoriesByAuthorUsername(user.id);
    return stories;
  }

  static async updateStory(
    storyId: string,
    storyData: UpdateStoryDTO
  ): Promise<Story | null> {
    const updatedStory = await StoryRepository.updateStory(storyId, storyData);
    if (!updatedStory) {
      throw new NotFoundError('Story not found');
    }
    return updatedStory;
  }

  static async deleteStory(storyId: string): Promise<boolean> {
    const isDeleted = await StoryRepository.deleteStory(storyId);
    if (!isDeleted) {
      throw new NotFoundError('Story not found');
    }
    return isDeleted;
  }

  static async countUserStories(authorId: string): Promise<number> {
    const count = await StoryRepository.countUserStories(authorId);
    return count;
  }
}

export default StoryService;
