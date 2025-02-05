import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.route('/users')
    .post(userController.createUser)
    .get(userController.getAllUsers);

router.route('/users/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/users/username/:username')
    .get(userController.getUserByUsername);

export default router;
