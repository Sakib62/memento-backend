import { Router } from 'express';
import SearchController from '../controllers/searchController';

const router = Router();

router.get('/', SearchController.searchAll);

export default router;
