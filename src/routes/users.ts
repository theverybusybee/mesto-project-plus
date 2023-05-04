import { getUsers, createUser, getUserById, updateProfile, updateAvatar } from "../controllers/user";
const router = require('express').Router();

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);

router.post("/users", createUser);

router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

export default router;
