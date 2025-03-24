import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userRoleMiddleware } from '../middlewares/roleMiddleware';
import AuthController from '../controllers/authController';

const router = Router();

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router
  .route('/:id/reset-Password')
  .put(authMiddleware, userRoleMiddleware, AuthController.resetPassword);

export default router;
