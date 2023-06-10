import auth from '../middlewares/auth';
import {
  getUsers,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/user';
import {
  avatarValidator,
  userDataValidator,
} from '../utils/validation';

const router = require('express').Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', userDataValidator, updateProfile);
router.patch('/me/avatar', avatarValidator, updateAvatar);

export default router;
