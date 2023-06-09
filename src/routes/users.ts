// import auth from '../middlewares/auth'
import {
  getUsers,
  createUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  login,
} from '../controllers/user';

const router = require('express').Router();

router.get('/', getUsers);

// router.post('/signup', createUser);
// router.post('/signin', login);

router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
