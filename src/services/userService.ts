import User from '../database/models/userModel';
import UserRepository from '../repositories/userRepository';

class UserService {
    static async createUser(user: User): Promise<User> {
        const newUser = await UserRepository.createUser(user);
        return newUser;
    }

    static async getAllUsers(): Promise<User[]> {
        const users = await UserRepository.getAllUsers();
        return users;
    }

    static async getUserById(userId: number): Promise<User | undefined> {
        const user = await UserRepository.getUserById(userId);
        return user;
    }

    static async getUserByUsername(username: string): Promise<User | undefined> {
        const user = await UserRepository.getUserByUsername(username);
        return user;
    }

    static async updateUser(userId: number, user: Partial<User>): Promise<User | undefined> {
        const updatedUser = await UserRepository.updateUser(userId, user);
        return updatedUser;
    }

    static async deleteUser(userId: number): Promise<boolean> {
        const idDeleted = await UserRepository.deleteUser(userId);
        return idDeleted;
    }
}

export default UserService;
