import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { submitAttempt, myResults } from '../controllers/attempts.controller.js';

const router = Router();

router.get('/me', authMiddleware, myResults);
router.post('/:id/submit', authMiddleware, submitAttempt);

export default router;
