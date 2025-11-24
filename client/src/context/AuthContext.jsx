import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signup = (email, password) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { id: 1, email };
        setCurrentUser(user);
        resolve(user);
      }, 1000);
    });
  };

  const login = (email, password) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { id: 1, email };
        setCurrentUser(user);
        resolve(user);
      }, 1000);
    });
  };

  const logout = () => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        resolve();
      }, 500);
    });
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};