import {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
} from '../controllers/user';

const router = require('express').Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.post('/signin', login);
router.post('/signup', createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
