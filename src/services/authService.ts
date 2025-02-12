import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repositories/authRepository';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errorClass';

class AuthService {
  static async createAuth(userId: number, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await AuthRepository.createAuth(userId, hashedPassword);
  }

  static async login(identifier: string, password: string): Promise<string> {
    const user = await AuthRepository.findUserByIdentifier(identifier);
    if (!user) throw new ValidationError();

    const authData = await AuthRepository.getAuthData(user.id);
    if (!authData) throw new NotFoundError();

    const isPasswordValid = await bcrypt.compare(password, authData.password);
    if (!isPasswordValid) throw new UnauthorizedError();

    const token = jwt.sign(
      { username: user.username, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2d' }
    );
    return token;
  }
}

export default AuthService;
