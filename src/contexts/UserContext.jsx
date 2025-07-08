import { createContext, useContext, useEffect, useState } from 'react';
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
  
  // State for user and role management
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Load users function
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load roles function
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const roleData = await userService.getRoles();
      setRoles(roleData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  // Create user function
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
      return newUser;
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.update(userId, userData);
      setUsers(prev => prev.map(u => u.Id === userId ? updatedUser : u));
      toast.success('User updated successfully');
      return updatedUser;
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      await userService.delete(userId);
      setUsers(prev => prev.filter(u => u.Id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when context mounts
  useEffect(() => {
    if (isAuthenticated && canManageUsers()) {
      loadUsers();
    }
    if (isAuthenticated && canManageRoles()) {
      loadRoles();
    }
  }, [isAuthenticated]);

  const value = {
    user,
    users,
    roles,
    loading,
    error,
    isAuthenticated,
    hasPermission,
    canAccessEvents,
    canManageUsers,
    canManageRoles,
    loadUsers,
    loadRoles,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};