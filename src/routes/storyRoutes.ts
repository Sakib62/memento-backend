import { Router } from 'express';
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
  .delete(authMiddleware, storyRoleMiddleware, StoryController.deleteStory);

router
  .route('/author/:username')
  .get(authMiddleware, StoryController.getStoriesByAuthorUsername);

export default router;
