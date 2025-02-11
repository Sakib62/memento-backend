import { Request, Response } from 'express';
import AuthService from '../services/authService';
import ResponseModel from '../utils/responseModel';

class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;
      const token = await AuthService.login(identifier, password);
      ResponseModel.send(res, 200, { token });
    } catch (error) {
      ResponseModel.send(res, 400, error.message);
    }
  }
}

export default AuthController;
