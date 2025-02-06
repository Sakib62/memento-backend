import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.route('/')
    .post(userController.createUser)
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/username/:username')
    .get(userController.getUserByUsername);

export default router;
