import db from '../config/db';
import CommentDTO from '../dtos/commentDTO';

class CommentRepository {
  static async createComment(
    userId: string,
    storyId: string,
    comment: string
  ): Promise<CommentDTO> {
    const [newComment] = await db('comments')
      .insert({ userId, storyId, comment })
      .returning('*');
    return newComment;
  }
  static async getCommentsForStory(storyId: string): Promise<CommentDTO[]> {
    return db('comments')
      .select(
        'comments.id',
        'comments.userId',
        'comments.comment',
        'comments.createdAt',
        'comments.updatedAt',
        'users.name as authorName',
        'users.username as authorUsername'
      )
      .join('users', 'comments.userId', 'users.id')
      .where('comments.storyId', storyId)
      .orderBy('comments.createdAt', 'desc');
  }

  static async getCommentById(commentId: string): Promise<CommentDTO> {
    return db('comments').where({ id: commentId }).first();
  }

  static async updateComment(
    commentId: string,
    comment: string
  ): Promise<CommentDTO> {
    const [updatedComment] = await db('comments')
      .where({ id: commentId })
      .update({ comment, updatedAt: new Date() })
      .returning('*');
    return updatedComment;
  }

  static async deleteComment(commentId: string): Promise<CommentDTO> {
    const [deletedComment] = await db('comments')
      .where({ id: commentId })
      .del()
      .returning('*');
    return deletedComment;
  }

  static async getCommentedStoriesByUser(userId: string) {
    const commentedStories = await db('stories')
      .join('comments', 'stories.id', 'comments.storyId')
      .join('users', 'stories.authorId', 'users.id')
      .where('comments.userId', userId)
      .select(
        'stories.id',
        'stories.title',
        'stories.description',
        'stories.tags',
        'stories.createdAt',
        'stories.updatedAt',
        'users.username as authorUsername',
        'users.name as authorName'
      )
      .max('comments.createdAt as latestCommentAt')
      .groupBy(
        'stories.id',
        'stories.title',
        'stories.description',
        'stories.tags',
        'stories.createdAt',
        'stories.updatedAt',
        'users.username',
        'users.name'
      )
      .orderBy('latestCommentAt', 'desc');

    return commentedStories;
  }

  static async getCommentCountByStory(storyId: string): Promise<number> {
    const result = await db('comments').where({ storyId }).count().first();
    return Number(result?.count) || 0;
  }

  static async countUserComments(userId: string): Promise<number> {
    const result = await db('comments')
      .where('userId', userId)
      .countDistinct('storyId as count')
      .first();

    return Number(result?.count) || 0;
  }
}

export default CommentRepository;
