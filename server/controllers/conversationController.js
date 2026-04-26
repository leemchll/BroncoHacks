import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const findOrCreateConversation = async (req, res) => {
    try {
        const {
            listingId, buyerId, sellerId,
            buyerUsername, sellerUsername, listingTitle, listingImage,
        } = req.body;

        if (!listingId || !buyerId || !sellerId) {
            return res.status(400).json({ message: 'listingId, buyerId, and sellerId are required' });
        }

        let conversation = await Conversation.findOne({ listingId, buyerId, sellerId });

        if (!conversation) {
            conversation = new Conversation({
                listingId,
                buyerId,
                sellerId,
                buyerUsername: buyerUsername || '',
                sellerUsername: sellerUsername || '',
                listingTitle: listingTitle || '',
                listingImage: listingImage || '',
                participants: [buyerId, sellerId],
                lastMessage: '',
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (err) {
        console.error('findOrCreateConversation error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await Conversation.find({ participants: userId }).sort({ updatedAt: -1 });

        if (!conversations.length) {
            return res.json([]);
        }

        // Aggregate unread counts for all conversations at once
        const convIds = conversations.map(c => c._id.toString());
        const unreadAgg = await Message.aggregate([
            { $match: { conversationId: { $in: convIds }, receiverId: userId, read: false } },
            { $group: { _id: '$conversationId', count: { $sum: 1 } } },
        ]);

        const unreadMap = {};
        unreadAgg.forEach(u => { unreadMap[u._id] = u.count; });

        const result = conversations.map(c => ({
            _id: c._id,
            listingId: c.listingId,
            buyerId: c.buyerId,
            sellerId: c.sellerId,
            buyerUsername: c.buyerUsername,
            sellerUsername: c.sellerUsername,
            listingTitle: c.listingTitle,
            listingImage: c.listingImage,
            participants: c.participants,
            lastMessage: c.lastMessage,
            updatedAt: c.updatedAt,
            createdAt: c.createdAt,
            unreadCount: unreadMap[c._id.toString()] || 0,
        }));

        res.json(result);
    } catch (err) {
        console.error('getUserConversations error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
