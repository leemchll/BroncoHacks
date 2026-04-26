import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import messageIcon from '../../imports/messageicon.png';
import { API_URL } from '../config';

export default function ChatModal({ listing, currentUser, onClose, initialConversationId, explicitReceiverId, onMarkRead }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    // cancelled flag guards against the React StrictMode double-invoke race:
    // StrictMode fires cleanup before the async init resolves, so without this
    // flag a stale socket from run-1 and a fresh socket from run-2 both join
    // the room and both register receiveMessage listeners → every message fires twice.
    let cancelled = false;
    let socket = null;

    const init = async () => {
      try {
        let convId;

        if (initialConversationId) {
          convId = initialConversationId;
        } else {
          const convRes = await fetch(`${API_URL}/api/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              listingId: listing.id?.toString() || listing._id?.toString(),
              buyerId: currentUser.id,
              sellerId: listing.sellerId,
              buyerUsername: currentUser.username,
              sellerUsername: listing.sellerUsername,
              listingTitle: listing.title,
              listingImage: listing.image,
            }),
          });

          if (!convRes.ok) {
            const err = await convRes.json();
            if (!cancelled) { setError(err.message || 'Could not start conversation'); setLoading(false); }
            return;
          }

          const conv = await convRes.json();
          convId = conv._id.toString();
        }

        // Bail if cleanup already ran while we were awaiting
        if (cancelled) return;

        setConversationId(convId);

        // Load existing messages
        const msgRes = await fetch(`${API_URL}/api/messages/${convId}`);
        const msgs = await msgRes.json();

        if (cancelled) return;

        setMessages(Array.isArray(msgs) ? msgs : []);

        // Mark messages as read
        try {
          const readRes = await fetch(`${API_URL}/api/messages/read/${convId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id }),
          });
          if (readRes.ok && !cancelled) {
            const readData = await readRes.json();
            if (readData.markedRead > 0) onMarkRead?.(readData.markedRead);
          }
        } catch {}

        if (cancelled) return;

        // Connect Socket.IO
        socket = io(API_URL, { transports: ['websocket', 'polling'] });
        socketRef.current = socket;

        socket.emit('joinConversation', convId);

        // Clear any stale listeners before registering
        socket.off('receiveMessage');
        socket.on('receiveMessage', (msg) => {
          setMessages((prev) => {
            // Deduplicate by _id — guards against any edge-case double emit
            const msgId = msg._id?.toString();
            if (msgId && prev.some(m => m._id?.toString() === msgId)) return prev;
            return [...prev, msg];
          });
        });

        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (err) {
        console.error('Chat init error:', err);
        if (!cancelled) {
          setError('Failed to connect to chat. Is the server running?');
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (socket) {
        socket.off('receiveMessage');
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId || !socketRef.current) return;

    // Send only through Socket.IO — the backend saves to MongoDB and emits
    // receiveMessage back to the room (including the sender). We do NOT add
    // the message locally here; we wait for the receiveMessage event so there
    // is exactly one code-path that adds messages to state.
    socketRef.current.emit('sendMessage', {
      conversationId,
      listingId: listing.id?.toString() || listing._id?.toString(),
      senderId: currentUser.id,
      receiverId: explicitReceiverId || listing.sellerId,
      text: text.trim(),
    });

    setText('');
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col z-10"
        style={{ height: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 rounded-t-2xl shrink-0">
          <img src={messageIcon} alt="Chat" className="w-6 h-6 object-contain" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {listing.title}
            </p>
            <p className="text-xs text-gray-400 truncate">Seller: {listing.seller || listing.sellerUsername}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-gray-400">Connecting...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-red-500 text-center px-4">{error}</p>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <img src={messageIcon} alt="" className="w-10 h-10 opacity-30" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          )}

          {!loading && !error && messages.map((msg, i) => {
            const isMine = msg.senderId === currentUser.id;
            return (
              <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    isMine
                      ? 'text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                  style={isMine ? { backgroundColor: '#5C9657' } : {}}
                >
                  <p className="break-words">{msg.text}</p>
                  <p className={`text-xs mt-0.5 ${isMine ? 'text-green-100' : 'text-gray-400'} text-right`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={loading || !!error}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!text.trim() || loading || !!error}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#5C9657' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
