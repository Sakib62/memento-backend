import { Router } from 'express';
import CommentController from '../controllers/commentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentRoleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router
  .route('/:id')
  .put(authMiddleware, commentRoleMiddleware, CommentController.editComment)
  .delete(
    authMiddleware,
    commentRoleMiddleware,
    CommentController.deleteComment
  );

export default router;
