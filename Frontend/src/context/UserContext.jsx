import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Step 1: Create Context
export const UserContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  isLoggedIn: false,
});

// Step 2: Provider Component
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const isLoggedIn = !!user && !!token;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          localStorage.removeItem("authToken");
          setUser(null);
          setToken(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Step 3: Custom Hook
export default function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
