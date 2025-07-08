import { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import userService from '@/services/api/userService';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Get user from Redux instead of local state
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return user.role.permissions.includes(permission) || user.role.permissions.includes('*');
  };

  const canAccessEvents = () => {
    return hasPermission('events:read') || hasPermission('events:write') || hasPermission('*');
  };

  const canManageUsers = () => {
    return hasPermission('users:write') || hasPermission('*');
  };

  const canManageRoles = () => {
    return hasPermission('roles:write') || hasPermission('*');
  };

  const value = {
    user,
    loading: false, // Handled by Redux now
    isAuthenticated,
    hasPermission,
    canAccessEvents,
    canManageUsers,
    canManageRoles
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};