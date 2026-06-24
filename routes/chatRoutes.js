import express from 'express';
import { queryAssistant, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/query', queryAssistant);
router.get('/history', getChatHistory);

export default router;