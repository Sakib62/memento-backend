import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repositories/authRepository';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errorClass';
import UserService from './userService';

class AuthService {
  static async createAuth(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await AuthRepository.createAuth(userId, hashedPassword);
  }

  static async login(identifier: string, password: string): Promise<string> {
    const user = await UserService.findUserByIdentifier(identifier);
    if (!user)
      throw new ValidationError('User not found with the provided identifier');

    const authData = await AuthRepository.getAuthData(user.id);
    if (!authData)
      throw new NotFoundError('Authentication data not found for the user');

    const isPasswordValid = await bcrypt.compare(password, authData.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { expiresIn: process.env.JWT_EXPIRY as any }
    );
    return token;
  }

  static async resetPassword(
    userId: string,
    currentPass: string,
    newPass: string
  ) {
    const authData = await AuthRepository.getAuthData(userId);
    if (!authData)
      throw new NotFoundError('Authentication data not found for the user');

    const isPasswordValid = await bcrypt.compare(
      currentPass,
      authData.password
    );
    if (!isPasswordValid)
      throw new UnauthorizedError('Incorrect Current Password');

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await AuthRepository.updateAuthData(userId, hashedPassword);

    return { message: 'Password reset successfully' };
  }
}

export default AuthService;
