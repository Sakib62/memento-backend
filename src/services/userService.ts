import CreateUserDTO from '../dtos/createUserDTO';
import UpdateUserDTO from '../dtos/updateUserDTO';
import UserDTO from '../dtos/userDTO';
import UserRepository from '../repositories/userRepository';
import AuthService from '../services/authService';
import mapToUserDTO from '../utils/userMapper';

class UserService {
  static async createUser(user: CreateUserDTO): Promise<UserDTO> {
    const { password, ...userWithoutPassword } = user;
    const newUser = await UserRepository.createUser(userWithoutPassword);
    await AuthService.createAuth(newUser.id, password);
    return mapToUserDTO(newUser);
  }

  static async getAllUsers(): Promise<UserDTO[]> {
    const users = await UserRepository.getAllUsers();
    return users.map(mapToUserDTO);
  }

  static async getUserById(userId: number): Promise<UserDTO | null> {
    const user = await UserRepository.getUserById(userId);
    return user ? mapToUserDTO(user) : null;
  }

  static async getUserByUsername(username: string): Promise<UserDTO | null> {
    const user = await UserRepository.getUserByUsername(username);
    return user ? mapToUserDTO(user) : null;
  }

  static async updateUser(
    userId: number,
    user: Partial<UpdateUserDTO>
  ): Promise<UserDTO | null> {
    const updatedUser = await UserRepository.updateUser(userId, user);
    return updatedUser ? mapToUserDTO(updatedUser) : null;
  }

  static async deleteUser(userId: number): Promise<boolean> {
    const idDeleted = await UserRepository.deleteUser(userId);
    return idDeleted;
  }
}

export default UserService;
