import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import listingRoutes from './routes/listingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => res.send('Backend is working'));
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// userId → socketId map for targeted notifications
const userSockets = new Map();

// Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user's socket for direct notifications
    socket.on('registerUser', (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`Registered user ${userId} → socket ${socket.id}`);
    });

    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on('sendMessage', async (data) => {
        try {
            const { conversationId, listingId, senderId, receiverId, text } = data;

            if (!text?.trim()) return;

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

            // Deliver to conversation room
            io.to(conversationId).emit('receiveMessage', message);

            // Notify receiver's notification socket (if online and not in this room)
            const receiverSocketId = userSockets.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('updateUnreadCount');
            }
        } catch (err) {
            console.error('sendMessage socket error:', err);
        }
    });

    socket.on('disconnect', () => {
        // Remove from userSockets map
        for (const [userId, sid] of userSockets.entries()) {
            if (sid === socket.id) {
                userSockets.delete(userId);
                console.log(`Unregistered user ${userId}`);
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5001;

connectDB();

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
