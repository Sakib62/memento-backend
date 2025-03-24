import db from '../config/db';
import Story from '../database/models/storyModel';

class StoryRepository {
  static async createStory(storyData: Story): Promise<Story> {
    const payload = {
      ...storyData,
      tags: JSON.stringify(storyData.tags || []),
    };

    const [newStory] = await db('stories').insert(payload).returning('*');
    return newStory;
  }

  static async getAllStories(offset: number, limit: number): Promise<Story[]> {
    const stories = await db('stories')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('createdAt', 'desc');
    return stories;
  }

  static async getStoryById(storyId: string): Promise<Story | null> {
    const story = await db('stories').where('id', storyId).first();
    return story;
  }

  static async getStoriesByAuthorUsername(
    authorUsername: string
  ): Promise<Story[] | null> {
    const stories = await db('stories').where('authorUsername', authorUsername);
    return stories;
  }

  static async updateStory(
    storyId: string,
    storyData: Partial<Story>
  ): Promise<Story | null> {
    const payload = {
      ...storyData,
      tags: JSON.stringify(storyData.tags || []),
    };
    const [updatedStory] = await db('stories')
      .where('id', storyId)
      .update(payload)
      .returning('*');
    return updatedStory;
  }

  static async deleteStory(storyId: string): Promise<boolean> {
    const deletedCount = await db('stories').where('id', storyId).del();
    return deletedCount > 0;
  }

  static async searchStoryTitle(
    pattern: string,
    limit: number,
    offset: number
  ) {
    const result = await db('stories')
      .select('*')
      .where('title', 'ilike', `%${pattern}%`)
      .limit(limit)
      .offset(offset);
    return result;
  }

  static async searchStoryDescription(
    pattern: string,
    limit: number,
    offset: number
  ) {
    const result = await db('stories')
      .select('*')
      .where('description', 'ilike', `%${pattern}%`)
      .limit(limit)
      .offset(offset);
    return result;
  }

  static async getStoriesByIds(storyIds: string[]) {
    return await db('stories')
      .whereIn('id', storyIds)
      .select(
        'id',
        'title',
        'description',
        'authorName',
        'tags',
        'authorUsername',
        'createdAt'
      );
  }
}

export default StoryRepository;
