import React from "react";
import Error from "@/components/ui/Error";
import mockUsers from "@/services/mockData/users.json";
import mockRoles from "@/services/mockData/roles.json";
// Role service using ApperClient for database operations
const roleService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "permissions" } },
          { field: { Name: "description" } },
          { field: { Name: "color" } },
          { field: { Name: "created_at" } },
          { field: { Name: "created_by" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  create: async (roleData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: roleData.name,
          permissions: JSON.stringify(roleData.permissions),
          description: roleData.description,
          color: roleData.color,
          created_at: new Date().toISOString(),
          created_by: 1
        }]
      };
      
      const response = await apperClient.createRecord('role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create role');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  }
};

const userService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockUsers];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.Id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  getByEmail: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.email === email);
    return user ? { ...user } : null;
  },

  create: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get role details
    const role = mockRoles.find(r => r.Id === userData.roleId);
    if (!role) {
      throw new Error('Invalid role selected');
    }

    const newUser = {
      ...userData,
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      role: { ...role },
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 1, // Current user ID
      lastLogin: null
    };
    
    mockUsers.push(newUser);
    return { ...newUser };
  },

  update: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    // Get role details if role changed
    let role = mockUsers[index].role;
    if (userData.roleId && userData.roleId !== mockUsers[index].roleId) {
      role = mockRoles.find(r => r.Id === userData.roleId);
      if (!role) {
        throw new Error('Invalid role selected');
      }
    }

    const updatedUser = { 
      ...mockUsers[index], 
      ...userData, 
      Id: id,
      role: { ...role }
    };
    
    mockUsers[index] = updatedUser;
    return { ...updatedUser };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    // Prevent deleting the last admin
    const user = mockUsers[index];
    if (user.role.name === 'Administrator') {
      const adminCount = mockUsers.filter(u => u.role.name === 'Administrator').length;
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last administrator');
      }
    }

    mockUsers.splice(index, 1);
    return true;
  },
getRoles: async () => {
    return await roleService.getAll();
  },

  createRole: async (roleData) => {
    return await roleService.create(roleData);
  },

  updateRole: async (id, roleData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // For now, fall back to mock data for role updates
    // This would be replaced with ApperClient updateRecord when needed
    throw new Error('Role update not implemented - using mock data');
  },

  deleteRole: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // For now, fall back to mock data for role deletion
    // This would be replaced with ApperClient deleteRecord when needed
    throw new Error('Role deletion not implemented - using mock data');
  },

  hasPermission: async (userId, permission) => {
    const user = mockUsers.find(u => u.Id === userId);
    if (!user || !user.role) return false;
    return user.role.permissions.includes(permission) || user.role.permissions.includes('*');
  }
};

export default userService;