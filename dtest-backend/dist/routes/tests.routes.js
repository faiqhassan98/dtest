import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { createTest, listTests, getTest, updateTest, deleteTest, nextTest, startTest } from '../controllers/tests.controller.js';
const router = Router();
router.get('/', authMiddleware, listTests); // admin or listing
router.post('/', authMiddleware, isAdmin, createTest);
router.get('/next', authMiddleware, nextTest); // get a random published test (optional level)
router.get('/:id', authMiddleware, getTest);
router.get('/:id/start', authMiddleware, startTest); // user starts test (sanitized)
router.patch('/:id', authMiddleware, isAdmin, updateTest);
router.delete('/:id', authMiddleware, isAdmin, deleteTest);
export default router;
