import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const { role, approved, approvedByCoach } = currentUser;

    // Redirect based on role
    if (role === 'admin') {
      if (approved) {
        navigate('/admin');
      } else {
        alert('Admin account not activated.');
        navigate('/login');
      }
    } else if (role === 'coach') {
      if (approved) {
        navigate('/coach-dashboard');
      } else {
        alert('Coach account pending approval.');
        navigate('/login');
      }
    } else if (role === 'participant') {
      if (approvedByCoach) {
        navigate('/dashboard'); // or your participant dashboard route
      } else {
        alert('Participant account pending coach approval.');
        navigate('/login');
      }
    } else {
      alert('Invalid user role.');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return <div>Redirecting...</div>;
};

export default AuthRedirect;
