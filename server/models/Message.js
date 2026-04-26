import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: { type: String, required: true },
    listingId: { type: String },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
