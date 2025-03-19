import { Router } from 'express';
import CommentController from '../controllers/commentController';
import LikeController from '../controllers/likeController';
import StoryController from '../controllers/storyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { storyRoleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router
  .route('/')
  .post(authMiddleware, StoryController.createStory)
  .get(authMiddleware, StoryController.getAllStories);

router
  .route('/:id')
  .get(authMiddleware, StoryController.getStoryById)
  .put(authMiddleware, storyRoleMiddleware, StoryController.updateStory)
  .delete(authMiddleware, storyRoleMiddleware, StoryController.deleteStory)
  .post(authMiddleware, LikeController.toggleLike);

router
  .route('/author/:username')
  .get(authMiddleware, StoryController.getStoriesByAuthorUsername);

router
  .route('/:id/likes/count')
  .get(authMiddleware, LikeController.getLikeCount);

router.route('/:id/likes').get(authMiddleware, LikeController.getStoryLikers);

router
  .route('/:id/likeStatus')
  .get(authMiddleware, LikeController.getLikeStatus);

router
  .route('/:id/comments')
  .get(authMiddleware, CommentController.getCommentsForStory)
  .post(authMiddleware, CommentController.createComment);

router
  .route('/:id/commentCount')
  .get(authMiddleware, CommentController.getCommentCountByStory);

export default router;
