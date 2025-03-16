import db from '../config/db';
import Auth from '../database/models/authModel';

class AuthRepository {
  static async createAuth(userId: string, password: string): Promise<void> {
    await db('auth').insert({ userId, password });
  }

  static async getAuthData(userId: string): Promise<Auth | null> {
    const data = db('auth').where({ userId: userId }).first();
    return data;
  }
}

export default AuthRepository;
