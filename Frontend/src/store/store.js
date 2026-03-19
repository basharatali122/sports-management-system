// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import chatReducer from './chatSlice';
// import notificationReducer from './notificationSlice';
// import userReducer from './userSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     chat: chatReducer,
//     notifications: notificationReducer,
//     users: userReducer,
//   },
// });

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    users: userReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export default store;