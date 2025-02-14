import Story from '../database/models/storyModel';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import StoryRepository from '../repositories/storyRepository';
import UserRepository from '../repositories/userRepository';
import { NotFoundError, ValidationError } from '../utils/errorClass';

class StoryService {
  static async createStory(storyData: CreateStoryDTO): Promise<Story> {
    const user = await UserRepository.getUserByUsername(
      storyData.authorUsername
    );
    if (!user) {
      throw new ValidationError();
    }
    const authorName = user.name;
    const newStory = await StoryRepository.createStory({
      ...storyData,
      authorName,
    });
    return newStory;
  }

  static async getAllStories(): Promise<Story[]> {
    const stories = await StoryRepository.getAllStories();
    return stories;
  }

  static async getStoryById(storyId: number): Promise<Story | null> {
    const story = await StoryRepository.getStoryById(storyId);
    if (!story) {
      throw new NotFoundError('Story not found');
    }
    return story;
  }

  static async updateStory(
    storyId: number,
    storyData: UpdateStoryDTO
  ): Promise<Story | null> {
    const updatedStory = await StoryRepository.updateStory(storyId, storyData);
    if (!updatedStory) {
      throw new NotFoundError('Story not found');
    }
    return updatedStory;
  }

  static async deleteStory(storyId: number): Promise<boolean> {
    const isDeleted = await StoryRepository.deleteStory(storyId);
    if (!isDeleted) {
      throw new NotFoundError('Story not found');
    }
    return isDeleted;
  }
}

export default StoryService;
