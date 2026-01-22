import { Router } from 'express';
import { login, signUp } from '../controllers/auth.controllers';

const router = Router();

// Example route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
router.post('/signup', signUp);
router.post('/login', login);

export default router;
