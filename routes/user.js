import express from 'express';
import { login, logout, me, register } from '../controllers/user.js';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/me", me);

export default router;
