import db from '../config/db';
import User from '../database/models/userModel';

class UserRepository {
  static async createUser(user: User): Promise<User> {
    const [newUser] = await db('users').insert(user).returning('*');
    return newUser;
  }

  static async getAllUsers(limit: number, offset: number): Promise<User[]> {
    const users = await db('users').select('*').limit(limit).offset(offset);
    return users;
  }

  static async getUserById(userId: number): Promise<User | null> {
    const user = await db('users').where({ id: userId }).first();
    return user;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const user = await db('users').where({ username: username }).first();
    return user;
  }

  static async updateUser(
    userId: number,
    user: Partial<User>
  ): Promise<User | null> {
    const [updatedUser] = await db('users')
      .where({ id: userId })
      .update(user)
      .returning('*');
    return updatedUser;
  }

  static async deleteUser(userId: number): Promise<boolean> {
    const deletedCount = await db('users').where({ id: userId }).del();
    return deletedCount > 0;
  }
}

export default UserRepository;
