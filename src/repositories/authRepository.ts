import db from '../config/db';

class AuthRepository {
  static async createAuth(userId: number, password: string): Promise<void> {
    await db('auth').insert({ userId, password });
  }
}

export default AuthRepository;
