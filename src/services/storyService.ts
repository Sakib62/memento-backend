import Story from '../database/models/storyModel';
import { UpdateStoryDTO } from '../dtos/storyDTO';
import StoryRepository from '../repositories/storyRepository';
import { NotFoundError } from '../utils/errorClass';

class StoryService {
  static async createStory(storyPayload: Story): Promise<Story> {
    const newStory = await StoryRepository.createStory(storyPayload);
    return newStory;
  }

  static async getAllStories(limit: number, offset: number): Promise<Story[]> {
    const stories = await StoryRepository.getAllStories(limit, offset);
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
