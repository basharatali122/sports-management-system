import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Chat from './Chat';
import { fetchUnreadCount } from '../../store/chatSlice';

const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      
      // Poll for unread count every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all z-50"
      >
        <div className="relative">
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <Chat
          currentUser={user}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatLauncher;