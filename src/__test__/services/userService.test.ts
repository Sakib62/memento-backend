import CreateUserDTO from '../../dtos/createUserDTO';
import UpdateUserDTO from '../../dtos/updateUserDTO';
import UserRepository from '../../repositories/userRepository';
import AuthService from '../../services/authService';
import UserService from '../../services/userService';
import { NotFoundError } from '../../utils/errorClass';
import mapToUserDTO from '../../utils/userMapper';

jest.mock('../../repositories/userRepository');
jest.mock('../../services/authService');
jest.mock('../../utils/userMapper');

describe('UserService', () => {
  const userRepository = UserRepository as jest.Mocked<typeof UserRepository>;
  const authService = AuthService as jest.Mocked<typeof AuthService>;

  const mapToUserDTOMock = mapToUserDTO as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser - should create a new user and call AuthService', async () => {
    const userData: CreateUserDTO = {
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com',
      password: 'securepassword',
    };

    const newUser = {
      id: 1,
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com',
    };

    userRepository.createUser.mockResolvedValue(newUser);
    authService.createAuth.mockResolvedValue(Promise.resolve());
    mapToUserDTOMock.mockReturnValue(newUser);

    const result = await UserService.createUser(userData);

    expect(userRepository.createUser).toHaveBeenCalledWith({
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com',
    });
    expect(authService.createAuth).toHaveBeenCalledWith(1, 'securepassword');
    expect(result).toEqual(newUser);
  });

  test('getAllUsers - should return users with pagination', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'user1',
        name: 'User One',
        email: 'user1@example.com',
      },
      {
        id: 2,
        username: 'user2',
        name: 'User Two',
        email: 'user2@example.com',
      },
    ];

    userRepository.getAllUsers.mockResolvedValue(mockUsers);
    mapToUserDTOMock.mockImplementation((user) => user);

    const result = await UserService.getAllUsers(10, 0);

    expect(userRepository.getAllUsers).toHaveBeenCalledWith(10, 0);
    expect(mapToUserDTOMock).toHaveBeenCalledTimes(mockUsers.length);
    expect(result).toEqual(mockUsers);
  });

  test('getUserById - should return user by ID', async () => {
    const mockUser = {
      id: 1,
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
    };
    userRepository.getUserById.mockResolvedValue(mockUser);
    mapToUserDTOMock.mockReturnValue(mockUser);

    const result = await UserService.getUserById(1);

    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(mapToUserDTOMock).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('getUserById - should throw NotFoundError if user not found', async () => {
    userRepository.getUserById.mockResolvedValue(null);

    await expect(UserService.getUserById(999)).rejects.toThrow(NotFoundError);
  });

  test('getUserByUsername - should return user by username', async () => {
    const mockUser = {
      id: 1,
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
    };
    userRepository.getUserByUsername.mockResolvedValue(mockUser);
    mapToUserDTOMock.mockReturnValue(mockUser);

    const result = await UserService.getUserByUsername('user1');

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith('user1');
    expect(mapToUserDTOMock).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('getUserByUsername - should throw NotFoundError if user not found', async () => {
    userRepository.getUserByUsername.mockResolvedValue(null);

    await expect(UserService.getUserByUsername('nonexistent')).rejects.toThrow(
      NotFoundError
    );
  });

  test('getUserByEmail - should return user by email', async () => {
    const mockUser = {
      id: 1,
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
    };

    userRepository.getUserByEmail.mockResolvedValue(mockUser);
    mapToUserDTOMock.mockReturnValue(mockUser);

    const result = await UserService.getUserByEmail('user1@example.com');

    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
      'user1@example.com'
    );
    expect(mapToUserDTOMock).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('getUserByEmail - should throw NotFoundError if user not found', async () => {
    userRepository.getUserByEmail.mockResolvedValue(null);

    await expect(
      UserService.getUserByEmail('nonexistent@example.com')
    ).rejects.toThrow(NotFoundError);
  });

  test('findUserByIdentifier - should return user by identifier', async () => {
    const mockUser = {
      id: 1,
      username: 'user1',
      name: 'User One',
      email: 'user1@example.com',
    };

    userRepository.findUserByIdentifier.mockResolvedValue(mockUser);
    mapToUserDTOMock.mockReturnValue(mockUser);

    const result = await UserService.findUserByIdentifier('user1');

    expect(userRepository.findUserByIdentifier).toHaveBeenCalledWith('user1');
    expect(mapToUserDTOMock).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('findUserByIdentifier - should throw NotFoundError if user not found', async () => {
    userRepository.findUserByIdentifier.mockResolvedValue(null);

    await expect(UserService.findUserByIdentifier('unknown')).rejects.toThrow(
      NotFoundError
    );
  });

  test('updateUser - should update user and return updated data', async () => {
    const userId = 1;
    const updateData: UpdateUserDTO = { name: 'Updated User' };

    const updatedUser = {
      username: 'user1',
      name: 'Updated User',
      email: 'user1@example.com',
    };
    userRepository.updateUser.mockResolvedValue(updatedUser);
    mapToUserDTOMock.mockReturnValue(updatedUser);

    const result = await UserService.updateUser(userId, updateData);

    expect(userRepository.updateUser).toHaveBeenCalledWith(userId, updateData);
    expect(mapToUserDTOMock).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual(updatedUser);
  });

  test('updateUser - should throw NotFoundError if user not found', async () => {
    const userId = 999;
    const updateData: UpdateUserDTO = { name: 'Nonexistent User' };

    userRepository.updateUser.mockResolvedValue(null);

    await expect(UserService.updateUser(userId, updateData)).rejects.toThrow(
      NotFoundError
    );
  });

  test('deleteUser - should delete user and return true', async () => {
    const userId = 1;
    userRepository.deleteUser.mockResolvedValue(true);

    const result = await UserService.deleteUser(userId);

    expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });

  test('deleteUser - should throw NotFoundError if user not found', async () => {
    const userId = 999;
    userRepository.deleteUser.mockResolvedValue(false);

    await expect(UserService.deleteUser(userId)).rejects.toThrow(NotFoundError);
  });
});
