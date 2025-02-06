import bcrypt from 'bcrypt'
import AuthRepository from "../repositories/authRepository";

class AuthService {
    static async createAuth(userId: number, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await AuthRepository.createAuth(userId, hashedPassword);
    }
}

export default AuthService;
