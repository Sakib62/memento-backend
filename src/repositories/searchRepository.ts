import db from '../config/db';

class SearchRepository {
  static async searchUser(pattern: string, limit: number, offset: number) {
    const result = await db('users')
      .select('*')
      .where('username', 'ilike', `%${pattern}%`)
      .limit(limit)
      .offset(offset);
    return result;
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
}

export default SearchRepository;
