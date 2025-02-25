import { Router } from 'express';
import userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userRoleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.route('/').get(authMiddleware, userController.getAllUsers);

router
  .route('/:id')
  .get(authMiddleware, userController.getUserById)
  .put(authMiddleware, userRoleMiddleware, userController.updateUser)
  .delete(authMiddleware, userRoleMiddleware, userController.deleteUser);

router
  .route('/username/:username')
  .get(authMiddleware, userController.getUserByUsername);

export default router;
