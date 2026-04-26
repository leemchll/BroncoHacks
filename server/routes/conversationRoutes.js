import express from 'express';
import { findOrCreateConversation, getUserConversations } from '../controllers/conversationController.js';

const router = express.Router();

router.post('/', findOrCreateConversation);
router.get('/user/:userId', getUserConversations);

export default router;
