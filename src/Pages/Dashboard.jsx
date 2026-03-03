import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setUser(response.data))
    .catch(() => {
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      
    </div>
  );
}
export default Dashboard;