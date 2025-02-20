import CreateUserDTO from '../dtos/createUserDTO';
import UpdateUserDTO from '../dtos/updateUserDTO';
import UserDTO from '../dtos/userDTO';
import UserRepository from '../repositories/userRepository';
import AuthService from '../services/authService';
import { NotFoundError, ValidationError } from '../utils/errorClass';
import mapToUserDTO from '../utils/userMapper';

class UserService {
  static async createUser(user: CreateUserDTO): Promise<UserDTO> {
    const { username, email, name, password } = user;

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    const existingUser =
      await UserRepository.getUserByUsername(normalizedUsername);
    if (existingUser) {
      throw new ValidationError('Username already exists');
    }

    const existingEmail = await UserRepository.getUserByEmail(normalizedEmail);
    if (existingEmail) {
      throw new ValidationError('Email already exists');
    }

    const newUser = await UserRepository.createUser({
      username: normalizedUsername,
      email: normalizedEmail,
      name,
    });
    await AuthService.createAuth(newUser.id, password);
    return mapToUserDTO(newUser);
  }

  static async getAllUsers(limit: number, offset: number): Promise<UserDTO[]> {
    const users = await UserRepository.getAllUsers(limit, offset);
    return users.map(mapToUserDTO);
  }

  static async getUserById(userId: number): Promise<UserDTO | null> {
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user ? mapToUserDTO(user) : null;
  }

  static async getUserByUsername(username: string): Promise<UserDTO | null> {
    const user = await UserRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user ? mapToUserDTO(user) : null;
  }

  static async updateUser(
    userId: number,
    user: Partial<UpdateUserDTO>
  ): Promise<UserDTO | null> {
    const updatedUser = await UserRepository.updateUser(userId, user);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    return updatedUser ? mapToUserDTO(updatedUser) : null;
  }

  static async deleteUser(userId: number): Promise<boolean> {
    const idDeleted = await UserRepository.deleteUser(userId);
    if (!idDeleted) {
      throw new NotFoundError('User not found');
    }
    return idDeleted;
  }
}

export default UserService;
