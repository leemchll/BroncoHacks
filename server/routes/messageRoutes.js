import express from 'express';
import { getMessages, saveMessage, getUnreadCount, markConversationRead } from '../controllers/messageController.js';

const router = express.Router();

router.get('/unread/:userId', getUnreadCount);
router.get('/:conversationId', getMessages);
router.post('/', saveMessage);
router.patch('/read/:conversationId', markConversationRead);

export default router;
