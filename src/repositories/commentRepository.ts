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
      .where('comments.userId', userId)
      .select('stories.*')
      .max('comments.createdAt as latestCommentAt') // Get the latest comment time
      .groupBy('stories.id')
      .orderBy('latestCommentAt', 'desc');

    return commentedStories;
  }

  static async getCommentCountByStory(storyId: string): Promise<number> {
    const result = await db('comments').where({ storyId }).count().first();
    return Number(result?.count) || 0;
  }
}

export default CommentRepository;
