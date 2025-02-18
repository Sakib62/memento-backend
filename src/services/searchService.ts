import SearchRepository from '../repositories/searchRepository';

class SearchService {
  static async searchAll(pattern: string, limit: number, offset: number) {
    const users = await SearchRepository.searchUser(pattern, limit, offset);

    const storyTitles = await SearchRepository.searchStoryTitle(
      pattern,
      limit,
      offset
    );

    const storyDescriptions = await SearchRepository.searchStoryDescription(
      pattern,
      limit,
      offset
    );

    return { users, storyTitles, storyDescriptions };
  }
}

export default SearchService;
