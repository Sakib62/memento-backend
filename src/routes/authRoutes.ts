import AuthController from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.route('/login').post(AuthController.login);

export default router;
