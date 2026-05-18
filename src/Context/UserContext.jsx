/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userInfo, adminInfo } from '../Variable';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const info = userInfo();
    setUser(info);
    const aInfo = adminInfo();
    setAdmin(aInfo);
  };

  useEffect(() => {
    refreshUser();
    setLoading(false);

    // Sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'GlamGait' || e.key === 'GlamGaitAdmin') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('GlamGait');
    localStorage.removeItem('GlamGaitAdmin');
    setUser(null);
    setAdmin(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <UserContext.Provider value={{ user, admin, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
