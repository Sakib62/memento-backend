import db from '../config/db';
import LikerDTO from '../dtos/likerDTO';

class LikeRepository {
  static async addLike(userId: string, storyId: string) {
    const [like] = await db('likes').insert({ userId, storyId }).returning('*');
    return like;
  }

  static async removeLike(userId: string, storyId: string) {
    const [deletedLike] = await db('likes')
      .where({ userId, storyId })
      .del()
      .returning('*');
    return deletedLike;
  }

  static async checkIfLiked(userId: string, storyId: string) {
    const like = await db('likes').where({ userId, storyId }).first();
    return like;
  }

  static async getLikeCount(storyId: string): Promise<number> {
    const result = await db('likes')
      .where({ storyId })
      .count('id as likeCount')
      .first();
    return Number(result?.likeCount) || 0;
  }

  static async getStoryLikers(storyId: string): Promise<LikerDTO[]> {
    return db('likes')
      .join('users', 'likes.userId', 'users.id')
      .where('likes.storyId', storyId)
      .select('users.id', 'users.username', 'users.name');
  }

  static async getLikedStoryIds(userId: string) {
    const result = await db('likes')
      .where({ userId: userId })
      .select('storyId');

    return result.map((row) => row.storyId);
  }

  static async getTopLikedStories(offset: number, limit: number) {
    const stories = await db('stories')
      .select(
        'stories.id',
        'stories.title',
        'stories.description',
        'stories.authorUsername',
        'stories.authorName',
        'stories.tags',
        'stories.createdAt',
        'stories.updatedAt'
      )
      .count('likes.id as likesCount')
      .leftJoin('likes', 'stories.id', 'likes.storyId')
      .groupBy('stories.id')
      .orderBy('likesCount', 'desc')
      .limit(limit)
      .offset(offset);

    return stories;
  }
}

export default LikeRepository;
