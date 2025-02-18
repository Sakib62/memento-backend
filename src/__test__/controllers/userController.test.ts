import { Request, Response } from 'express';
import { ValidationError } from '../../utils/errorClass';
import UserController from '../../controllers/userController';
import UserService from '../../services/userService';
import { HttpStatus } from '../../utils/httpStatus';
import ResponseModel from '../../utils/responseModel';

jest.mock('../../services/userService');
jest.mock('../../utils/responseModel', () => ({
  send: jest.fn(),
}));

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('createUser - should call UserService.createUser and return 201', async () => {
    req.body = {
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'securepassword',
    };

    (UserService.createUser as jest.Mock).mockResolvedValue(req.body);

    await UserController.createUser(req as Request, res as Response, next);

    expect(UserService.createUser).toHaveBeenCalledWith(req.body);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.CREATED,
      req.body
    );
  });

  test('createUser - should call next with ValidationError if fields are missing', async () => {
    req.body = { username: '', name: '', email: '', password: '' };
    await UserController.createUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new ValidationError());
  });

  test('getAllUsers - should call UserService.getAllUsers and return 200', async () => {
    req.query = { limit: '10', offset: '0' };

    const mockUsers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    await UserController.getAllUsers(req as Request, res as Response, next);

    expect(UserService.getAllUsers).toHaveBeenCalledWith(10, 0);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockUsers
    );
  });

  test('getAllUsers - should return ValidationError if limit is invalid', async () => {
    req.query = { limit: '-1', offset: '0' };
    await UserController.getAllUsers(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError('Limit must be a positive integer between 1 and 100.')
    );
  });

  test('getAllUsers - should return ValidationError if offset is invalid', async () => {
    req.query = { limit: '10', offset: '1001' };
    await UserController.getAllUsers(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError('Offset must be a integer between 0 and 1000.')
    );
  });

  test('getUserById - should call UserService.getUserById and return 200', async () => {
    req.params = { id: '1' };

    const mockUser = { id: 1, username: 'user1' };
    (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    await UserController.getUserById(req as Request, res as Response, next);

    expect(UserService.getUserById).toHaveBeenCalledWith(1);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockUser
    );
  });

  test('getUserByUsername - should call UserService.getUserByUsername and return 200', async () => {
    req.params = { username: 'user1' };

    const mockUser = { id: 1, username: 'user1' };
    (UserService.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

    await UserController.getUserByUsername(
      req as Request,
      res as Response,
      next
    );

    expect(UserService.getUserByUsername).toHaveBeenCalledWith('user1');
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockUser
    );
  });

  test('updateUser - should call UserService.updateUser and return 200', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Updated User' };

    const mockUpdatedUser = { id: 1, username: 'user1', name: 'Updated User' };
    (UserService.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

    await UserController.updateUser(req as Request, res as Response, next);

    expect(UserService.updateUser).toHaveBeenCalledWith(1, req.body);
    expect(ResponseModel.send).toHaveBeenCalledWith(
      res,
      HttpStatus.OK,
      mockUpdatedUser
    );
  });

  test('deleteUser - should call UserService.deleteUser and return 200', async () => {
    req.params = { id: '1' };

    (UserService.deleteUser as jest.Mock).mockResolvedValue(true);

    await UserController.deleteUser(req as Request, res as Response, next);

    expect(UserService.deleteUser).toHaveBeenCalledWith(1);
    expect(ResponseModel.send).toHaveBeenCalledWith(res, HttpStatus.OK);
  });
});
