import {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/user';

const router = require('express').Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.post(createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
