import express from 'express';
import { signup, login, updateUser, getUser,logout } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();


router.post('/update-user',authenticate, updateUser);
router.get('/users', authenticate, getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);


export default router;