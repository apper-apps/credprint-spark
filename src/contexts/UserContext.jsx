import { createContext, useContext, useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const loadCurrentUser = async () => {
    try {
      // Simulate getting current user (in real app, would check auth token)
      const currentUserId = localStorage.getItem('currentUserId') || '1';
      const userData = await userService.getById(parseInt(currentUserId));
      setUser(userData);
    } catch (error) {
      console.error('Failed to load current user:', error);
      // Default to admin user for demo
      const defaultUser = await userService.getById(1);
      setUser(defaultUser);
      localStorage.setItem('currentUserId', '1');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      toast.error('Failed to load roles');
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
      return newUser;
    } catch (error) {
      toast.error('Failed to create user');
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData);
      setUsers(prev => prev.map(u => u.Id === id ? updatedUser : u));
      if (user && user.Id === id) {
        setUser(updatedUser);
      }
      toast.success('User updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error('Failed to update user');
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.Id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      throw error;
    }
  };

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

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
    loadRoles();
  }, []);

  const value = {
    user,
    loading,
    users,
    roles,
    setUser,
    loadUsers,
    loadRoles,
    createUser,
    updateUser,
    deleteUser,
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