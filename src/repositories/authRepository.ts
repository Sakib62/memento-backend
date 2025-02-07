import db from '../config/db';
import Auth from '../database/models/authModel';
import User from '../database/models/userModel';

class AuthRepository {
  static async createAuth(userId: number, password: string): Promise<void> {
    await db('auth').insert({ userId, password });
  }

  static async findUserByIdentifier(identifier: string): Promise<User | null> {
    const query = db('users')
      .where('username', identifier)
      .orWhere('email', identifier)
      .first();

    return query;
  }

  static async getAuthData(userId: number): Promise<Auth | null> {
    const data = db('auth').where({ userId: userId }).first();
    return data;
  }
}

export default AuthRepository;
