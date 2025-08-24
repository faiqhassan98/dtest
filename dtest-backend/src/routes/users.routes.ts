import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = Router();

// All user management endpoints require admin
router.use(authMiddleware, isAdmin);

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
