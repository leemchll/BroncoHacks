import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    listingId: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    buyerUsername: { type: String, default: '' },
    sellerUsername: { type: String, default: '' },
    listingTitle: { type: String, default: '' },
    listingImage: { type: String, default: '' },
    participants: [{ type: String }],
    lastMessage: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
