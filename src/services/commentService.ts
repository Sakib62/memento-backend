import CommentDTO from '../dtos/commentDTO';
import CommentRepository from '../repositories/commentRepository';

class CommentService {
  static async createComment(
    userId: string,
    storyId: string,
    comment: string
  ): Promise<CommentDTO> {
    const newComment = await CommentRepository.createComment(
      userId,
      storyId,
      comment
    );
    return newComment;
  }

  static async getCommentsForStory(storyId: string): Promise<CommentDTO[]> {
    const comments = await CommentRepository.getCommentsForStory(storyId);
    return comments;
  }

  static async editComment(
    commentId: string,
    comment: string
  ): Promise<CommentDTO> {
    const updatedComment = await CommentRepository.updateComment(
      commentId,
      comment
    );
    return updatedComment;
  }

  static async deleteComment(commentId: string): Promise<CommentDTO> {
    const deletedComment = await CommentRepository.deleteComment(commentId);
    return deletedComment;
  }

  static async getCommentedStoriesByUser(userId: string) {
    const commentedStories =
      await CommentRepository.getCommentedStoriesByUser(userId);
    return commentedStories;
  }

  static async getCommentCountByStory(storyId: string): Promise<number> {
    const commentCount =
      await CommentRepository.getCommentCountByStory(storyId);
    return commentCount;
  }

  static async countUserComments(userId: string): Promise<number> {
    const count = await CommentRepository.countUserComments(userId);
    return count;
  }
}

export default CommentService;
