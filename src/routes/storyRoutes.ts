import express from 'express';
import StoryController from '../controllers/storyController';

const router = express.Router();

router
  .route('/')
  .post(StoryController.createStory)
  .get(StoryController.getAllStories);

router
  .route('/:id')
  .get(StoryController.getStoryById)
  .put(StoryController.updateStory)
  .delete(StoryController.deleteStory);

export default router;
