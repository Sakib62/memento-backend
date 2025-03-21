import LikerDTO from '../dtos/likerDTO';
import LikeRepository from '../repositories/likeRepository';
import StoryRepository from '../repositories/storyRepository';

class LikesService {
  static async toggleLike(userId: string, storyId: string) {
    const existingLike = await LikeRepository.checkIfLiked(userId, storyId);

    if (existingLike) {
      await LikeRepository.removeLike(userId, storyId);
    } else {
      await LikeRepository.addLike(userId, storyId);
    }

    const likeCount = await LikeRepository.getLikeCount(storyId);
    return { likeCount };
  }

  static async getLikeCount(storyId: string): Promise<number> {
    return LikeRepository.getLikeCount(storyId);
  }

  static async getStoryLikers(storyId: string): Promise<LikerDTO[]> {
    return LikeRepository.getStoryLikers(storyId);
  }

  static async getLikedStoriesByUser(userId: string) {
    const likedStoryIds = await LikeRepository.getLikedStoryIds(userId);
    if (!likedStoryIds.length) {
      return [];
    }

    const likedStories = await StoryRepository.getStoriesByIds(likedStoryIds);
    return likedStories;
  }

  static async getTopLikedStories() {
    const stories = await LikeRepository.getTopLikedStories();
    return stories;
  }
}

export default LikesService;
