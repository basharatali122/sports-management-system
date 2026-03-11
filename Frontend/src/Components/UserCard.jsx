import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
      <h4 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h4>
      <p className="text-sm text-gray-600 mb-4">{user.email}</p>
      
      <Link to={`/chat/${user._id}`}>
        <button className="bg-green-500 hover:bg-sky-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-300">
          Chat
        </button>
      </Link>
    </div>
  );
};

export default UserCard;
