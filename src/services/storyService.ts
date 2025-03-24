import Story from '../database/models/storyModel';
import { UpdateStoryDTO } from '../dtos/storyDTO';
import StoryRepository from '../repositories/storyRepository';
import { NotFoundError } from '../utils/errorClass';
import UserService from './userService';

class StoryService {
  static async createStory(storyPayload: Story): Promise<Story> {
    const newStory = await StoryRepository.createStory(storyPayload);
    return newStory;
  }

  static async getAllStories(offset: number, limit: number): Promise<Story[]> {
    const stories = await StoryRepository.getAllStories(offset, limit);
    return stories;
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
    const normalizedUsername = username.toLowerCase();
    await UserService.getUserByUsername(normalizedUsername);
    const stories =
      await StoryRepository.getStoriesByAuthorUsername(normalizedUsername);
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
}

export default StoryService;
