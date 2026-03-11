import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import { motion } from 'framer-motion';
import { Users, UserSquare } from 'lucide-react';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    const response = await axios.get("http://localhost:3000/users/getAllUsers");
    return response.data;
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-blue-500 animate-pulse">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
         User Feed
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No users found.</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {users.map(user => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 hover:shadow-lg transition duration-300"
            >
              <UserCard user={user} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Feed;
