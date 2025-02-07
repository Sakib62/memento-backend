import db from '../config/db';
import User from '../database/models/userModel';

class UserRepository {
  static async createUser(user: User): Promise<User> {
    const [newUser] = await db('users').insert(user).returning('*');
    return newUser;
  }

  static async getAllUsers(): Promise<User[]> {
    const users = await db('users').select('*');
    return users;
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    const user = await db('users').where({ id: userId }).first();
    return user;
  }

  static async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await db('users').where({ username: username }).first();
    return user;
  }

  static async updateUser(
    userId: number,
    user: Partial<User>
  ): Promise<User | undefined> {
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
