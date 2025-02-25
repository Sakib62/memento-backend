import { Router } from 'express';
import SearchController from '../controllers/searchController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, SearchController.searchAll);

export default router;
