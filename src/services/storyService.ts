import { NotFoundError } from '../utils/errorClass';
import Story from '../database/models/storyModel';
import { CreateStoryDTO, UpdateStoryDTO } from '../dtos/storyDTO';
import StoryRepository from '../repositories/storyRepository';
import UserRepository from '../repositories/userRepository';

class StoryService {
  static async createStory(storyData: CreateStoryDTO): Promise<Story> {
    const user = await UserRepository.getUserByUsername(
      storyData.authorUsername
    );
    if (!user) {
      throw new NotFoundError();
    }
    const authorName = user.name;
    return StoryRepository.createStory({ ...storyData, authorName });
  }

  static async getAllStories(): Promise<Story[]> {
    const stories = StoryRepository.getAllStories();
    return stories;
  }

  static async getStoryById(storyId: number): Promise<Story | null> {
    const story = StoryRepository.getStoryById(storyId);
    return story;
  }

  static async updateStory(
    storyId: number,
    storyData: UpdateStoryDTO
  ): Promise<Story | null> {
    const updatedStory = StoryRepository.updateStory(storyId, storyData);
    return updatedStory;
  }

  static async deleteStory(storyId: number): Promise<boolean> {
    const isDeleted = StoryRepository.deleteStory(storyId);
    return isDeleted;
  }
}

export default StoryService;
