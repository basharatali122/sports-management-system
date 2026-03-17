import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversations,
  fetchChatHistory,
  sendMessage,
  fetchUnreadCount,
  addMessage,
  clearCurrentChat
} from '../../store/chatSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const UserMessage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, currentChat, loading } = useSelector((state) => state.chat);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleSelectUser = (conversation) => {
    setSelectedUser(conversation.user);
    dispatch(fetchChatHistory(conversation.user._id));
    setShowChat(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    await dispatch(sendMessage({
      receiverId: selectedUser._id,
      message: message.trim()
    }));
    setMessage('');
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedUser(null);
    dispatch(clearCurrentChat());
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex overflow-hidden">
      {/* Users List */}
      <div className={`${showChat ? 'hidden md:block' : 'block'} md:w-1/3 w-full border-r overflow-y-auto`}>
        <div className="p-4 bg-indigo-600 text-white">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.user._id}
              onClick={() => handleSelectUser(conv)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                selectedUser?._id === conv.user._id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conv.user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conv.lastMessage?.created_at && formatTime(conv.lastMessage.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage?.message}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="inline-block mt-1 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
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
      <div className={`${!showChat ? 'hidden md:flex' : 'flex'} md:w-2/3 w-full flex-col`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="md:hidden p-2 hover:bg-gray-200 rounded-full"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div>
                <h3 className="font-medium">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentChat.messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                      msg.sender === user?._id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === user?._id ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;