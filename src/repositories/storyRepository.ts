import db from '../config/db';
import Story from '../database/models/storyModel';

class StoryRepository {
  static async createStory(storyData: Story): Promise<Story> {
    const [newStory] = await db('stories').insert(storyData).returning('*');
    return newStory;
  }

  static async getAllStories(limit: number, offset: number): Promise<Story[]> {
    const stories = await db('stories').select('*').limit(limit).offset(offset);
    return stories;
  }

  static async getStoryById(storyId: number): Promise<Story | null> {
    const story = await db('stories').where('id', storyId).first();
    return story;
  }

  static async updateStory(
    storyId: number,
    storyData: Partial<Story>
  ): Promise<Story | null> {
    const [updatedStory] = await db('stories')
      .where('id', storyId)
      .update(storyData)
      .returning('*');
    return updatedStory;
  }

  static async deleteStory(storyId: number): Promise<boolean> {
    const deletedCount = await db('stories').where('id', storyId).del();
    return deletedCount > 0;
  }
}

export default StoryRepository;
