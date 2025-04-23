import db from '../config/db';
import Story from '../database/models/storyModel';

class StoryRepository {
  static async createStory(storyData: Partial<Story>): Promise<Story> {
    const payload = {
      ...storyData,
      tags: JSON.stringify(storyData.tags || []),
    };

    const [newStory] = await db('stories').insert(payload).returning('*');
    return newStory;
  }

  static async getAllStories(offset: number, limit: number): Promise<Story[]> {
    const stories = await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      )
      .orderBy('stories.createdAt', 'desc')
      .limit(limit)
      .offset(offset);
    return stories;
  }

  static async getStoryById(storyId: string): Promise<Story | null> {
    const story = await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      )
      .where('stories.id', storyId)
      .first();
    return story;
  }

  static async getStoriesByAuthorUsername(
    authorId: string
  ): Promise<Story[] | null> {
    const stories = await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      )
      .where('authorId', authorId);
    return stories;
  }

  static async updateStory(
    storyId: string,
    storyData: Partial<Story>
  ): Promise<Story | null> {
    const payload = {
      ...storyData,
      tags: JSON.stringify(storyData.tags || []),
      updatedAt: db.fn.now(),
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
  ): Promise<Story[] | null> {
    const result = await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      )
      .where('title', 'ilike', `%${pattern}%`)
      .limit(limit)
      .offset(offset);
    return result;
  }

  static async searchStoryDescription(
    pattern: string,
    limit: number,
    offset: number
  ): Promise<Story[] | null> {
    const result = await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      )
      .where('description', 'ilike', `%${pattern}%`)
      .limit(limit)
      .offset(offset);
    return result;
  }

  static async getStoriesByIds(storyIds: string[]) {
    return await db('stories')
      .join('users', 'stories.authorId', '=', 'users.id')
      .whereIn('stories.id', storyIds)
      .select(
        'stories.*',
        { authorUsername: 'users.username' },
        { authorName: 'users.name' }
      );
  }
}

export default StoryRepository;
