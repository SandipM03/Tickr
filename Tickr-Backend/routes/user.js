import express from 'express';
import { 
    signup, 
    login, 
    updateUser, 
    getUser,
    logout,
    getAllUsers,
    getUsersByRole,
    promoteToModerator,
    updateUserSkills
} from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Admin-only routes
router.get('/admin/users', requireAdmin, getAllUsers);
router.get('/admin/users/role/:role', requireAdmin, getUsersByRole);
router.patch('/admin/users/:userId/promote', requireAdmin, promoteToModerator);
router.patch('/admin/users/:userId/skills', requireAdmin, updateUserSkills);

// Legacy routes (maintain backward compatibility)
router.post('/update-user', requireAdmin, updateUser);
router.get('/users', requireAdmin, getUser);

export default router;