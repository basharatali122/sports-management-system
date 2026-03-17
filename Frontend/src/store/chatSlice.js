// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// // Async thunks
// export const fetchConversations = createAsyncThunk(
//   'chat/fetchConversations',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.get(`${API_URL}/chat/conversations`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data.data.conversations;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
//     }
//   }
// );

// export const fetchChatHistory = createAsyncThunk(
//   'chat/fetchChatHistory',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.get(`${API_URL}/chat/history?userId=${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch chat history');
//     }
//   }
// );

// export const sendMessage = createAsyncThunk(
//   'chat/sendMessage',
//   async ({ receiverId, message }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.post(
//         `${API_URL}/chat/send`,
//         { receiverId, message },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to send message');
//     }
//   }
// );

// export const markMessagesRead = createAsyncThunk(
//   'chat/markMessagesRead',
//   async (senderId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       await axios.post(
//         `${API_URL}/chat/read`,
//         { senderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return senderId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to mark messages as read');
//     }
//   }
// );

// export const fetchUnreadCount = createAsyncThunk(
//   'chat/fetchUnreadCount',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.get(`${API_URL}/chat/unread`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data.data.unreadCount;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch unread count');
//     }
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     conversations: [],
//     currentChat: {
//       user: null,
//       messages: []
//     },
//     unreadCount: 0,
//     loading: false,
//     error: null,
//     socketConnected: false
//   },
//   reducers: {
//     setSocketConnected: (state, action) => {
//       state.socketConnected = action.payload;
//     },
//     addMessage: (state, action) => {
//       const message = action.payload;
      
//       // Add to current chat if it's for the current conversation
//       if (state.currentChat.user && 
//           (message.sender === state.currentChat.user._id || 
//            message.receiver === state.currentChat.user._id)) {
//         state.currentChat.messages.push(message);
//       }
      
//       // Update conversation list
//       const conversationIndex = state.conversations.findIndex(
//         conv => conv.user._id === (message.sender === state.currentChat.user?._id 
//           ? message.receiver : message.sender)
//       );
      
//       if (conversationIndex !== -1) {
//         state.conversations[conversationIndex].lastMessage = message;
//         if (message.receiver === state.currentChat.user?._id && !message.isRead) {
//           state.conversations[conversationIndex].unreadCount += 1;
//         }
//       }
      
//       // Update unread count
//       if (message.receiver === state.currentChat.user?._id && !message.isRead) {
//         state.unreadCount += 1;
//       }
//     },
//     markMessagesAsRead: (state, action) => {
//       const { senderId } = action.payload;
      
//       // Mark messages in current chat
//       if (state.currentChat.user && state.currentChat.user._id === senderId) {
//         state.currentChat.messages = state.currentChat.messages.map(msg => ({
//           ...msg,
//           isRead: true
//         }));
//       }
      
//       // Update unread count in conversations
//       const conversation = state.conversations.find(
//         conv => conv.user._id === senderId
//       );
//       if (conversation) {
//         state.unreadCount -= conversation.unreadCount;
//         conversation.unreadCount = 0;
//       }
//     },
//     clearCurrentChat: (state) => {
//       state.currentChat = {
//         user: null,
//         messages: []
//       };
//     },
//     updateMessageStatus: (state, action) => {
//       const { messageId, isRead } = action.payload;
      
//       // Update in current chat
//       const message = state.currentChat.messages.find(m => m._id === messageId);
//       if (message) {
//         message.isRead = isRead;
//       }
//     },
//     resetChat: (state) => {
//       state.conversations = [];
//       state.currentChat = { user: null, messages: [] };
//       state.unreadCount = 0;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Conversations
//       .addCase(fetchConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConversations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.conversations = action.payload;
//       })
//       .addCase(fetchConversations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Chat History
//       .addCase(fetchChatHistory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchChatHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentChat = {
//           user: action.payload.user,
//           messages: action.payload.messages.reverse()
//         };
//       })
//       .addCase(fetchChatHistory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Send Message
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         // Message will be added via socket
//       })
      
//       // Fetch Unread Count
//       .addCase(fetchUnreadCount.fulfilled, (state, action) => {
//         state.unreadCount = action.payload;
//       });
//   }
// });

// export const {
//   setSocketConnected,
//   addMessage,
//   markMessagesAsRead,
//   clearCurrentChat,
//   updateMessageStatus,
//   resetChat
// } = chatSlice.actions;

// export default chatSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get token from multiple possible locations
const getToken = () => {
  return localStorage.getItem('token') || 
         localStorage.getItem('accessToken') || 
         null;
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.conversations;
    } catch (error) {
      console.error('Fetch conversations error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}/chat/history?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Fetch chat history error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch chat history');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { receiverId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Send message error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const markMessagesRead = createAsyncThunk(
  'chat/markMessagesRead',
  async (senderId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      await axios.post(
        `${API_URL}/chat/read`,
        { senderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return senderId;
    } catch (error) {
      console.error('Mark messages read error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to mark messages as read');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}/chat/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.unreadCount;
    } catch (error) {
      console.error('Fetch unread count error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch unread count');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    currentChat: {
      user: null,
      messages: []
    },
    unreadCount: 0,
    loading: false,
    error: null,
    socketConnected: false
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      
      // Add to current chat if it's for the current conversation
      if (state.currentChat.user && 
          (message.sender === state.currentChat.user._id || 
           message.receiver === state.currentChat.user._id)) {
        state.currentChat.messages.push(message);
      }
      
      // Update conversation list
      const conversationIndex = state.conversations.findIndex(
        conv => conv.user._id === (message.sender === state.currentChat.user?._id 
          ? message.receiver : message.sender)
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        if (message.receiver === state.currentChat.user?._id && !message.isRead) {
          state.conversations[conversationIndex].unreadCount += 1;
        }
      }
      
      // Update unread count
      if (message.receiver === state.currentChat.user?._id && !message.isRead) {
        state.unreadCount += 1;
      }
    },
    markMessagesAsRead: (state, action) => {
      const { senderId } = action.payload;
      
      // Mark messages in current chat
      if (state.currentChat.user && state.currentChat.user._id === senderId) {
        state.currentChat.messages = state.currentChat.messages.map(msg => ({
          ...msg,
          isRead: true
        }));
      }
      
      // Update unread count in conversations
      const conversation = state.conversations.find(
        conv => conv.user._id === senderId
      );
      if (conversation) {
        state.unreadCount -= conversation.unreadCount;
        conversation.unreadCount = 0;
      }
    },
    clearCurrentChat: (state) => {
      state.currentChat = {
        user: null,
        messages: []
      };
    },
    updateMessageStatus: (state, action) => {
      const { messageId, isRead } = action.payload;
      
      // Update in current chat
      const message = state.currentChat.messages.find(m => m._id === messageId);
      if (message) {
        message.isRead = isRead;
      }
    },
    resetChat: (state) => {
      state.conversations = [];
      state.currentChat = { user: null, messages: [] };
      state.unreadCount = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Chat History
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = {
          user: action.payload.user,
          messages: action.payload.messages.reverse()
        };
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        // Message will be added via socket
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Unread Count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark Messages Read
      .addCase(markMessagesRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markMessagesRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markMessagesRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSocketConnected,
  addMessage,
  markMessagesAsRead,
  clearCurrentChat,
  updateMessageStatus,
  resetChat
} = chatSlice.actions;

export default chatSlice.reducer;