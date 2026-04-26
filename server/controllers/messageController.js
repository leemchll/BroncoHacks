import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error('getMessages error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, listingId, senderId, receiverId, text } = req.body;

        if (!conversationId || !senderId || !receiverId || !text?.trim()) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const message = new Message({
            conversationId,
            listingId,
            senderId,
            receiverId,
            text: text.trim(),
        });

        await message.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text.trim(),
        });

        res.status(201).json(message);
    } catch (err) {
        console.error('saveMessage error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Message.countDocuments({ receiverId: userId, read: false });
        res.json({ count });
    } catch (err) {
        console.error('getUnreadCount error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markConversationRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const result = await Message.updateMany(
            { conversationId, receiverId: userId, read: false },
            { $set: { read: true } }
        );

        res.json({ markedRead: result.modifiedCount });
    } catch (err) {
        console.error('markConversationRead error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
