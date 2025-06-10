import express from 'express';
import { register, login, getProfile} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register );
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

export default router;
