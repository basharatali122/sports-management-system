// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const res = await axios.get('http://localhost:3000/users/me', {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setCurrentUser(res.data);
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('accessToken'));

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
        
        if (storedToken) {
          setToken(storedToken);
          
          // Try the new profile endpoint first
          try {
            const res = await axios.get(`${API_URL}/users/profile/getProfile`, {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            setCurrentUser(res.data.data.user);
          } catch (profileError) {
            // Fall back to the old endpoint
            try {
              const res = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${storedToken}` }
              });
              setCurrentUser(res.data);
            } catch (oldEndpointError) {
              console.error('Both auth endpoints failed:', oldEndpointError);
              // Clear invalid token
              localStorage.removeItem('token');
              localStorage.removeItem('accessToken');
              setToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

  const login = (newToken, userData) => {
    // Store token in both formats for backward compatibility
    localStorage.setItem('token', newToken);
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    setCurrentUser(userData);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    // Remove tokens from both storage locations
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    setToken(null);
    setCurrentUser(null);
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const value = {
    // Existing properties for backward compatibility
    currentUser,
    setCurrentUser,
    loading,
    
    // New properties for enhanced functionality
    user: currentUser, // Alias for currentUser
    token,
    isAuthenticated: !!currentUser,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};