import { Router } from 'express';
import CommentController from '../controllers/commentController';
import LikeController from '../controllers/likeController';
import UserController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { optionalAuth } from '../middlewares/optionalAuth';
import { userRoleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.route('/').get(authMiddleware, UserController.getAllUsers);

router
  .route('/:id')
  .get(authMiddleware, UserController.getUserById)
  .put(authMiddleware, userRoleMiddleware, UserController.updateUser)
  .delete(authMiddleware, userRoleMiddleware, UserController.deleteUser);

router
  .route('/username/:username')
  .get(optionalAuth, UserController.getUserByUsername);

router
  .route('/:id/stories/liked')
  .get(authMiddleware, LikeController.getLikedStoriesByUser);

router
  .route('/:id/stories/commented')
  .get(authMiddleware, CommentController.getCommentedStoriesByUser);

export default router;
