// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// // Async thunks
// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async ({ limit = 50, skip = 0, unreadOnly = false } = {}, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const url = `${API_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`;
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
//     }
//   }
// );

// export const markNotificationRead = createAsyncThunk(
//   'notifications/markNotificationRead',
//   async (notificationId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       await axios.post(
//         `${API_URL}/notifications/${notificationId}/read`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return notificationId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
//     }
//   }
// );

// export const markAllNotificationsRead = createAsyncThunk(
//   'notifications/markAllNotificationsRead',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       await axios.post(
//         `${API_URL}/notifications/read-all`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return true;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to mark all as read');
//     }
//   }
// );

// export const deleteNotification = createAsyncThunk(
//   'notifications/deleteNotification',
//   async (notificationId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       await axios.delete(`${API_URL}/notifications/${notificationId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return notificationId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
//     }
//   }
// );

// export const sendAdminNotification = createAsyncThunk(
//   'notifications/sendAdminNotification',
//   async ({ title, message, targetRole, userIds = [] }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.post(
//         `${API_URL}/notifications/admin/send`,
//         { title, message, targetRole, userIds },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to send notification');
//     }
//   }
// );

// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState: {
//     notifications: [],
//     unreadCount: 0,
//     hasMore: false,
//     loading: false,
//     error: null
//   },
//   reducers: {
//     addNotification: (state, action) => {
//       state.notifications.unshift(action.payload);
//       if (!action.payload.isRead) {
//         state.unreadCount += 1;
//       }
//     },
//     markAsRead: (state, action) => {
//       const notification = state.notifications.find(n => n._id === action.payload);
//       if (notification && !notification.isRead) {
//         notification.isRead = true;
//         state.unreadCount -= 1;
//       }
//     },
//     markAllRead: (state) => {
//       state.notifications.forEach(n => {
//         if (!n.isRead) n.isRead = true;
//       });
//       state.unreadCount = 0;
//     },
//     removeNotification: (state, action) => {
//       const index = state.notifications.findIndex(n => n._id === action.payload);
//       if (index !== -1) {
//         if (!state.notifications[index].isRead) {
//           state.unreadCount -= 1;
//         }
//         state.notifications.splice(index, 1);
//       }
//     },
//     resetNotifications: (state) => {
//       state.notifications = [];
//       state.unreadCount = 0;
//       state.hasMore = false;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Notifications
//       .addCase(fetchNotifications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notifications = action.payload.notifications;
//         state.unreadCount = action.payload.unreadCount;
//         state.hasMore = action.payload.hasMore;
//       })
//       .addCase(fetchNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Mark Notification Read
//       .addCase(markNotificationRead.fulfilled, (state, action) => {
//         const notification = state.notifications.find(n => n._id === action.payload);
//         if (notification && !notification.isRead) {
//           notification.isRead = true;
//           state.unreadCount -= 1;
//         }
//       })
      
//       // Mark All Notifications Read
//       .addCase(markAllNotificationsRead.fulfilled, (state) => {
//         state.notifications.forEach(n => {
//           if (!n.isRead) n.isRead = true;
//         });
//         state.unreadCount = 0;
//       })
      
//       // Delete Notification
//       .addCase(deleteNotification.fulfilled, (state, action) => {
//         const index = state.notifications.findIndex(n => n._id === action.payload);
//         if (index !== -1) {
//           if (!state.notifications[index].isRead) {
//             state.unreadCount -= 1;
//           }
//           state.notifications.splice(index, 1);
//         }
//       });
//   }
// });

// export const {
//   addNotification,
//   markAsRead,
//   markAllRead,
//   removeNotification,
//   resetNotifications
// } = notificationSlice.actions;

// export default notificationSlice.reducer;



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
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ limit = 50, skip = 0, unreadOnly = false } = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const url = `${API_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Fetch notifications error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      await axios.post(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return notificationId;
    } catch (error) {
      console.error('Mark notification read error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      await axios.post(
        `${API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (error) {
      console.error('Mark all read error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return notificationId;
    } catch (error) {
      console.error('Delete notification error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
    }
  }
);

export const sendAdminNotification = createAsyncThunk(
  'notifications/sendAdminNotification',
  async ({ title, message, targetRole, userIds = [] }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('No authentication token found. Please login again.');
      }

      console.log('Sending notification with token:', token.substring(0, 20) + '...'); // Debug log

      const response = await axios.post(
        `${API_URL}/notifications/admin/send`,
        { title, message, targetRole, userIds },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Send notification error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 422) {
        return rejectWithValue('Authentication failed. Please login again.');
      }
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to send notifications.');
      }
      
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.msg || 
        'Failed to send notification'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    hasMore: false,
    loading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => {
        if (!n.isRead) n.isRead = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n._id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].isRead) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.hasMore = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark Notification Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
      })
      
      // Mark All Notifications Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => {
          if (!n.isRead) n.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount -= 1;
          }
          state.notifications.splice(index, 1);
        }
      })
      
      // Send Admin Notification
      .addCase(sendAdminNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendAdminNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendAdminNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  addNotification,
  markAsRead,
  markAllRead,
  removeNotification,
  resetNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;