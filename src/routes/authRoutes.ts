import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);

export default router;
