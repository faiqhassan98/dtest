import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { overview, userPerformance } from '../controllers/stats.controller.js';
const router = Router();
router.use(authMiddleware, isAdmin);
router.get('/overview', overview);
router.get('/user/:userId', userPerformance);
export default router;
