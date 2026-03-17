import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  fetchConversations,
  fetchChatHistory,
  sendMessage,
  markMessagesRead,
  fetchUnreadCount,
  addMessage,
  markMessagesAsRead,
  clearCurrentChat,
  setSocketConnected
} from '../../store/chatSlice';
import {
  fetchNotifications,
  addNotification,
  markAsRead,
  removeNotification
} from '../../store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  BellIcon,
  CheckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Chat = ({ currentUser, onClose }) => {
  const dispatch = useDispatch();
  const { conversations, currentChat, unreadCount, socketConnected } = useSelector(
    (state) => state.chat
  );
  const { notifications, unreadCount: notifUnreadCount } = useSelector(
    (state) => state.notifications
  );
  
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'notifications'
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    const newSocket = io(API_URL, {
      query: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: 5
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected');
      dispatch(setSocketConnected(true));
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      dispatch(setSocketConnected(false));
    });
    
    // Listen for private messages
    newSocket.on(`private_message_${currentUser._id}`, (data) => {
      if (data.type === 'new_message') {
        dispatch(addMessage(data.message));
        
        // Show notification if not in current chat
        if (!currentChat.user || currentChat.user._id !== data.message.sender) {
          // You could show a toast notification here
          console.log('New message from:', data.message.senderName);
        }
      } else if (data.type === 'messages_read') {
        dispatch(markMessagesAsRead({ senderId: data.readerId }));
      }
    });
    
    // Listen for notifications
    newSocket.on(`notifications_${currentUser._id}`, (data) => {
      if (data.type === 'new_notification') {
        dispatch(addNotification(data.notification));
      } else if (data.type === 'notification_read') {
        dispatch(markAsRead(data.notificationId));
      } else if (data.type === 'notification_deleted') {
        dispatch(removeNotification(data.notificationId));
      } else if (data.type === 'all_read') {
        // Handle all read
      }
    });
    
    // Listen for typing indicators
    newSocket.on(`typing_${currentUser._id}`, (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: data.isTyping
      }));
      
      // Auto-clear typing after 3 seconds if not updated
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [data.userId]: false
          }));
        }, 3000);
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser._id, dispatch]);
  
  // Load initial data
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications({ limit: 20 }));
  }, [dispatch]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat.messages]);
  
  // Mark messages as read when viewing chat
  useEffect(() => {
    if (currentChat.user && currentChat.messages.length > 0) {
      const hasUnread = currentChat.messages.some(
        m => m.sender === currentChat.user._id && !m.isRead
      );
      
      if (hasUnread) {
        dispatch(markMessagesRead(currentChat.user._id));
        
        if (socket) {
          socket.emit('mark_read', {
            readerId: currentUser._id,
            senderId: currentChat.user._id
          });
        }
      }
    }
  }, [currentChat.user, currentChat.messages, dispatch, socket, currentUser._id]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChat.user) return;
    
    const messageText = message.trim();
    setMessage('');
    
    // Send via REST API
    const result = await dispatch(
      sendMessage({
        receiverId: currentChat.user._id,
        message: messageText
      })
    );
    
    if (result.payload && socket) {
      // Emit via socket for real-time
      socket.emit('send_message', {
        senderId: currentUser._id,
        receiverId: currentChat.user._id,
        message: messageText
      });
    }
  };
  
  const handleSelectConversation = (conversation) => {
    dispatch(fetchChatHistory(conversation.user._id));
    setShowNotificationPanel(false);
  };
  
  const handleTyping = (isTyping) => {
    if (!socket || !currentChat.user) return;
    
    socket.emit('typing', {
      senderId: currentUser._id,
      receiverId: currentChat.user._id,
      isTyping
    });
  };
  
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!typingTimeoutRef.current) {
      handleTyping(true);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };
  
  const handleMarkNotificationRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };
  
  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };
  
  const handleSendAdminNotification = async (title, message, targetRole) => {
    if (!title || !message) return;
    
    setLoading(true);
    await dispatch(
      sendAdminNotification({
        title,
        message,
        targetRole: targetRole || 'all'
      })
    );
    setLoading(false);
  };
  
  const formatMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };
  
  return (
    <div className="fixed bottom-0 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">Messages</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-1 hover:bg-indigo-700 rounded"
          >
            <BellIcon className="h-5 w-5" />
            {notifUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifUnreadCount}
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'chats'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Chats
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'notifications'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Notifications
          {notifUnreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {notifUnreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chats' ? (
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${currentChat.user ? 'w-1/3' : 'w-full'} border-r overflow-y-auto`}>
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.user._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      currentChat.user?._id === conv.user._id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium text-gray-900 truncate">
                            {conv.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {conv.lastMessage?.created_at && 
                              formatMessageTime(conv.lastMessage.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage?.message}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="inline-block bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 mt-1">
                            {conv.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Chat Area */}
            {currentChat.user ? (
              <div className="w-2/3 flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{currentChat.user.name}</p>
                      <p className="text-xs text-gray-500">{currentChat.user.role}</p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                >
                  {currentChat.messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          msg.sender === currentUser._id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                          msg.sender === currentUser._id ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          <span>{formatMessageTime(msg.created_at)}</span>
                          {msg.sender === currentUser._id && (
                            msg.isRead ? (
                              <CheckBadgeSolid className="h-3 w-3" />
                            ) : (
                              <CheckIcon className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {currentChat.user && typingUsers[currentChat.user._id] && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-2/3 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        ) : (
          /* Notifications Panel */
          <div className="h-full overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatMessageTime(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkNotificationRead(notification._id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Admin Notification Button (only for admins) */}
      {currentUser.role === 'admin' && (
        <div className="p-3 border-t">
          <button
            onClick={() => {
              const title = prompt('Enter notification title:');
              const message = prompt('Enter notification message:');
              if (title && message) {
                handleSendAdminNotification(title, message);
              }
            }}
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-700"
          >
            Send Admin Notification
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;