import StoryRepository from '../repositories/storyRepository';
import UserRepository from '../repositories/userRepository';

class SearchService {
  static async searchAll(pattern: string, limit: number, offset: number) {
    const users = await UserRepository.searchUser(pattern, limit, offset);

    const storyTitles = await StoryRepository.searchStoryTitle(
      pattern,
      limit,
      offset
    );

    const storyDescriptions = await StoryRepository.searchStoryDescription(
      pattern,
      limit,
      offset
    );

    return { users, storyTitles, storyDescriptions };
  }
}

export default SearchService;
