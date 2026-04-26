import { useState, useEffect } from 'react';
import messageIcon from '../../imports/messageicon.png';
import { API_URL } from '../config';

export default function MessagesPanel({ currentUser, onClose, onOpenChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`${API_URL}/api/conversations/user/${currentUser.id}`)
      .then(r => r.json())
      .then(data => { setConversations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentUser?.id]);

  const handleOpenConversation = (conv) => {
    const isBuyer = currentUser.id === conv.buyerId;
    const receiverId = isBuyer ? conv.sellerId : conv.buyerId;
    const reconstructedListing = {
      id: conv.listingId,
      title: conv.listingTitle || 'Listing',
      image: conv.listingImage || null,
      sellerId: conv.sellerId,
      seller: conv.sellerUsername,
      sellerUsername: conv.sellerUsername,
    };
    onOpenChat(reconstructedListing, conv._id, receiverId);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-sm shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <img src={messageIcon} alt="" className="w-5 h-5" />
            <h2 className="font-semibold text-gray-900">Messages</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400 px-6">
              <img src={messageIcon} alt="" className="w-12 h-12 opacity-20" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs text-gray-300 text-center">Start by messaging a seller on a listing</p>
            </div>
          )}

          {!loading && conversations.map(conv => {
            const isBuyer = currentUser.id === conv.buyerId;
            const otherUser = isBuyer ? conv.sellerUsername : conv.buyerUsername;
            const hasUnread = conv.unreadCount > 0;

            return (
              <button
                key={conv._id}
                onClick={() => handleOpenConversation(conv)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                  {conv.listingImage ? (
                    <img src={conv.listingImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {otherUser || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{formatTime(conv.updatedAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.listingTitle || 'Listing'}</p>
                  <p className={`text-xs truncate mt-0.5 ${hasUnread ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>

                {hasUnread && (
                  <span
                    className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: '#5C9657' }}
                  >
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
