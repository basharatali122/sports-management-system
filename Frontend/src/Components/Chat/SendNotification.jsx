// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { sendAdminNotification } from '../../store/notificationSlice';
// import { fetchUsers } from '../../store/userSlice';
// import {
//   BellIcon,
//   UserGroupIcon,
//   UserIcon,
//   UsersIcon
// } from '@heroicons/react/24/outline';

// const SendNotification = () => {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.users);
//   const { loading } = useSelector((state) => state.notifications);
  
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');
//   const [targetRole, setTargetRole] = useState('all');
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showUserSelector, setShowUserSelector] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const notificationData = {
//       title,
//       message,
//       targetRole: targetRole === 'specific' ? null : targetRole,
//       userIds: targetRole === 'specific' ? selectedUsers : []
//     };

//     const result = await dispatch(sendAdminNotification(notificationData));
    
//     if (result.payload) {
//       setSuccess(true);
//       setTitle('');
//       setMessage('');
//       setSelectedUsers([]);
//       setTimeout(() => setSuccess(false), 3000);
//     }
//   };

//   const handleSelectUser = (userId) => {
//     setSelectedUsers(prev => {
//       if (prev.includes(userId)) {
//         return prev.filter(id => id !== userId);
//       } else {
//         return [...prev, userId];
//       }
//     });
//   };

//   const filteredUsers = users?.filter(u => 
//     u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const getTargetCount = () => {
//     if (targetRole === 'specific') return selectedUsers.length;
//     if (targetRole === 'all') return users?.length || 0;
//     return users?.filter(u => u.role === targetRole).length || 0;
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-indigo-600 px-6 py-4">
//           <h2 className="text-xl font-semibold text-white flex items-center">
//             <BellIcon className="h-6 w-6 mr-2" />
//             Send Broadcast Notification
//           </h2>
//         </div>

//         {/* Success Message */}
//         {success && (
//           <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//             Notification sent successfully!
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Notification Title
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="e.g., Important Announcement"
//             />
//           </div>

//           {/* Message */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Message
//             </label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               required
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="Enter your notification message here..."
//             />
//           </div>

//           {/* Target Audience */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Send To
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setTargetRole('all')}
//                 className={`p-3 border rounded-lg flex flex-col items-center ${
//                   targetRole === 'all' 
//                     ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
//                     : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <UsersIcon className="h-6 w-6 mb-1" />
//                 <span className="text-sm">All Users</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setTargetRole('admin')}
//                 className={`p-3 border rounded-lg flex flex-col items-center ${
//                   targetRole === 'admin' 
//                     ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
//                     : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <UserIcon className="h-6 w-6 mb-1" />
//                 <span className="text-sm">Admins</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setTargetRole('coach')}
//                 className={`p-3 border rounded-lg flex flex-col items-center ${
//                   targetRole === 'coach' 
//                     ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
//                     : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <UserGroupIcon className="h-6 w-6 mb-1" />
//                 <span className="text-sm">Coaches</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setTargetRole('participant')}
//                 className={`p-3 border rounded-lg flex flex-col items-center ${
//                   targetRole === 'participant' 
//                     ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
//                     : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <UsersIcon className="h-6 w-6 mb-1" />
//                 <span className="text-sm">Participants</span>
//               </button>
//             </div>
//           </div>

//           {/* Specific Users Selector */}
//           {targetRole === 'specific' && (
//             <div>
//               <button
//                 type="button"
//                 onClick={() => setShowUserSelector(!showUserSelector)}
//                 className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
//               >
//                 {showUserSelector ? 'Hide' : 'Show'} User Selection
//               </button>
              
//               {showUserSelector && (
//                 <div className="mt-3 border rounded-lg p-4">
//                   <input
//                     type="text"
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full p-2 border rounded-lg mb-3"
//                   />
//                   <div className="max-h-60 overflow-y-auto space-y-2">
//                     {filteredUsers.map((user) => (
//                       <label
//                         key={user._id}
//                         className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedUsers.includes(user._id)}
//                           onChange={() => handleSelectUser(user._id)}
//                           className="h-4 w-4 text-indigo-600 rounded"
//                         />
//                         <div>
//                           <p className="font-medium">{user.name}</p>
//                           <p className="text-sm text-gray-500">{user.email} ({user.role})</p>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Summary */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-600">
//               This notification will be sent to: <span className="font-semibold">
//                 {targetRole === 'specific' 
//                   ? `${selectedUsers.length} selected users`
//                   : targetRole === 'all'
//                   ? 'all users'
//                   : `all ${targetRole}s`}
//               </span>
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               Estimated recipients: {getTargetCount()}
//             </p>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || !title || !message || (targetRole === 'specific' && selectedUsers.length === 0)}
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//           >
//             {loading ? 'Sending...' : 'Send Notification'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SendNotification;



import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendAdminNotification } from '../../store/notificationSlice';
import { fetchUsers } from '../../store/userSlice';
import {
  BellIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const SendNotification = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { loading, error } = useSelector((state) => state.notifications);
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Check if user is admin (you might want to get this from auth context)
  const token = localStorage.getItem('token');
  const isAdmin = true; // You should verify this from your auth context

  useEffect(() => {
    if (!token) {
      setAuthError(true);
      toast.error('Please login first');
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes('Authentication') || error.includes('login')) {
        setAuthError(true);
      }
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (targetRole === 'specific' && selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (!token) {
      toast.error('No authentication token found. Please login again.');
      setAuthError(true);
      return;
    }

    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      targetRole: targetRole === 'specific' ? null : targetRole,
      userIds: targetRole === 'specific' ? selectedUsers : []
    };

    try {
      const result = await dispatch(sendAdminNotification(notificationData)).unwrap();
      
      if (result) {
        setSuccess(true);
        setTitle('');
        setMessage('');
        setSelectedUsers([]);
        toast.success(`✅ Notification sent to ${result.notificationCount || 'selected'} users`);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to send notification:', err);
      // Error is already handled by the toast in useEffect
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const filteredUsers = users?.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTargetCount = () => {
    if (!users) return 0;
    if (targetRole === 'specific') return selectedUsers.length;
    if (targetRole === 'all') return users.length;
    return users.filter(u => u.role === targetRole).length || 0;
  };

  // Show authentication error
  if (authError || !token) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-600 mb-4">
            Please login to access the notification system.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <BellIcon className="h-6 w-6 mr-2" />
            Send Broadcast Notification
          </h2>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="mx-6 mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Token present: {token ? '✅' : '❌'}</p>
          <p>Token length: {token?.length || 0} characters</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Notification sent successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Important Announcement"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your notification message here..."
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setTargetRole('all')}
                className={`p-3 border rounded-lg flex flex-col items-center transition ${
                  targetRole === 'all' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <UsersIcon className="h-6 w-6 mb-1" />
                <span className="text-sm">All Users</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('admin')}
                className={`p-3 border rounded-lg flex flex-col items-center transition ${
                  targetRole === 'admin' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <UserIcon className="h-6 w-6 mb-1" />
                <span className="text-sm">Admins</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('coach')}
                className={`p-3 border rounded-lg flex flex-col items-center transition ${
                  targetRole === 'coach' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <UserGroupIcon className="h-6 w-6 mb-1" />
                <span className="text-sm">Coaches</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('participant')}
                className={`p-3 border rounded-lg flex flex-col items-center transition ${
                  targetRole === 'participant' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <UsersIcon className="h-6 w-6 mb-1" />
                <span className="text-sm">Participants</span>
              </button>
            </div>
          </div>

          {/* Specific Users Selector */}
          {targetRole === 'specific' && (
            <div>
              <button
                type="button"
                onClick={() => setShowUserSelector(!showUserSelector)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {showUserSelector ? 'Hide' : 'Show'} User Selection
              </button>
              
              {showUserSelector && (
                <div className="mt-3 border rounded-lg p-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No users found</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email} ({user.role})</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              This notification will be sent to: <span className="font-semibold">
                {targetRole === 'specific' 
                  ? `${selectedUsers.length} selected users`
                  : targetRole === 'all'
                  ? 'all users'
                  : `all ${targetRole}s`}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Estimated recipients: {getTargetCount()}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim() || !message.trim() || (targetRole === 'specific' && selectedUsers.length === 0)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotification;