import mockUsers from "@/services/mockData/users.json";
import mockRoles from "@/services/mockData/roles.json";

// Permission service using ApperClient for database operations
const permissionService = {
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
          { field: { Name: "description" } },
          { field: { Name: "code" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('permission', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
  },

  create: async (permissionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: permissionData.name,
          description: permissionData.description,
          code: permissionData.code
        }]
      };
      
      const response = await apperClient.createRecord('permission', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create permission');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating permission:", error);
      throw error;
    }
  }
};

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
  },

  update: async (id, roleData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: id,
          Name: roleData.name,
          permissions: JSON.stringify(roleData.permissions),
          description: roleData.description,
          color: roleData.color
        }]
      };
      
      const response = await apperClient.updateRecord('role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update role');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete role');
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  }
};

// User-Role relationship service using ApperClient
const userRoleService = {
  getByUserId: async (userId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "user" } },
          { field: { Name: "role" } }
        ],
        where: [
          {
            FieldName: "user",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('user_role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching user roles:", error);
      throw error;
    }
  },

  create: async (userId, roleId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          user: userId,
          role: roleId
        }]
      };
      
      const response = await apperClient.createRecord('user_role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create user role');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating user role:", error);
      throw error;
    }
  },

  deleteByUserId: async (userId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // First get all user-role relationships for this user
      const userRoles = await this.getByUserId(userId);
      
      if (userRoles.length === 0) {
        return true;
      }
      
      const params = {
        RecordIds: userRoles.map(ur => ur.Id)
      };
      
      const response = await apperClient.deleteRecord('user_role', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user roles:", error);
      throw error;
    }
  }
};

const userService = {
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
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "isActive" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        // Fallback to mock data on error
        await new Promise(resolve => setTimeout(resolve, 200));
        return [...mockUsers];
      }
      
      // Transform database users to match UI expectations
      const users = response.data.map(user => ({
        ...user,
        name: user.Name || `${user.firstName} ${user.lastName}`.trim(),
        status: user.isActive ? 'active' : 'inactive',
        createdAt: user.CreatedOn
      }));
      
      // Get roles for each user
      const usersWithRoles = await Promise.all(users.map(async (user) => {
        const userRoles = await userRoleService.getByUserId(user.Id);
        let role = null;
        
        if (userRoles.length > 0) {
          // Get the first role (assuming single role per user for now)
          const roles = await roleService.getAll();
          role = roles.find(r => r.Id === userRoles[0].role);
        }
        
        return {
          ...user,
          role: role || null,
          roleId: role ? role.Id : null
        };
      }));
      
      return usersWithRoles;
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...mockUsers];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "isActive" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_User', id, params);
      
      if (!response.success || !response.data) {
        throw new Error('User not found');
      }
      
      const user = {
        ...response.data,
        name: response.data.Name || `${response.data.firstName} ${response.data.lastName}`.trim(),
        status: response.data.isActive ? 'active' : 'inactive',
        createdAt: response.data.CreatedOn
      };
      
      // Get user roles
      const userRoles = await userRoleService.getByUserId(user.Id);
      let role = null;
      
      if (userRoles.length > 0) {
        const roles = await roleService.getAll();
        role = roles.find(r => r.Id === userRoles[0].role);
      }
      
      return {
        ...user,
        role: role || null,
        roleId: role ? role.Id : null
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 200));
      const user = mockUsers.find(u => u.Id === id);
      if (!user) {
        throw new Error('User not found');
      }
      return { ...user };
    }
  },

  getByEmail: async (email) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "email" } },
          { field: { Name: "isActive" } }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: [email]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_User', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const user = response.data[0];
      return {
        ...user,
        name: user.Name || `${user.firstName} ${user.lastName}`.trim(),
        status: user.isActive ? 'active' : 'inactive'
      };
    } catch (error) {
      console.error("Error fetching user by email:", error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 200));
      const user = mockUsers.find(u => u.email === email);
      return user ? { ...user } : null;
    }
  },

  create: async (userData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Validate role exists
      const roles = await roleService.getAll();
      const role = roles.find(r => r.Id === userData.roleId);
      if (!role) {
        throw new Error('Invalid role selected');
      }
      
      // Create user record
      const params = {
        records: [{
          Name: userData.name,
          firstName: userData.name.split(' ')[0] || '',
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          email: userData.email,
          isActive: userData.status === 'active'
        }]
      };
      
      const response = await apperClient.createRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create user');
        }
        
        const newUser = successfulRecords[0].data;
        
        // Create user-role relationship
        await userRoleService.create(newUser.Id, userData.roleId);
        
        return {
          ...newUser,
          name: newUser.Name,
          status: newUser.isActive ? 'active' : 'inactive',
          role: { ...role },
          roleId: role.Id
        };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
        createdBy: 1,
        lastLogin: null
      };
      
      mockUsers.push(newUser);
      return { ...newUser };
    }
  },

  update: async (id, userData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Validate role exists if provided
      let role = null;
      if (userData.roleId) {
        const roles = await roleService.getAll();
        role = roles.find(r => r.Id === userData.roleId);
        if (!role) {
          throw new Error('Invalid role selected');
        }
      }
      
      // Update user record
      const params = {
        records: [{
          Id: id,
          Name: userData.name,
          firstName: userData.name.split(' ')[0] || '',
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          email: userData.email,
          isActive: userData.status === 'active'
        }]
      };
      
      const response = await apperClient.updateRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update user');
        }
        
        const updatedUser = successfulRecords[0].data;
        
        // Update user-role relationship if role changed
        if (userData.roleId && role) {
          await userRoleService.deleteByUserId(id);
          await userRoleService.create(id, userData.roleId);
        }
        
        return {
          ...updatedUser,
          name: updatedUser.Name,
          status: updatedUser.isActive ? 'active' : 'inactive',
          role: role || null,
          roleId: role ? role.Id : null
        };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockUsers.findIndex(u => u.Id === id);
      if (index === -1) {
        throw new Error('User not found');
      }

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
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Delete user-role relationships first
      await userRoleService.deleteByUserId(id);
      
      // Delete user record
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete user');
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockUsers.findIndex(u => u.Id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      
      const user = mockUsers[index];
      if (user.role.name === 'Administrator') {
        const adminCount = mockUsers.filter(u => u.role.name === 'Administrator').length;
        if (adminCount <= 1) {
          throw new Error('Cannot delete the last administrator');
        }
      }

      mockUsers.splice(index, 1);
      return true;
    }
  },

  getRoles: async () => {
    return await roleService.getAll();
  },

  createRole: async (roleData) => {
    return await roleService.create(roleData);
  },

  updateRole: async (id, roleData) => {
    return await roleService.update(id, roleData);
  },

  deleteRole: async (id) => {
    return await roleService.delete(id);
  },

  getPermissions: async () => {
    return await permissionService.getAll();
  },

  createPermission: async (permissionData) => {
    return await permissionService.create(permissionData);
  },

  hasPermission: async (userId, permission) => {
    try {
      const user = await userService.getById(userId);
      if (!user || !user.role) return false;
      
      const permissions = Array.isArray(user.role.permissions) 
        ? user.role.permissions 
        : JSON.parse(user.role.permissions || '[]');
      
      return permissions.includes(permission) || permissions.includes('*');
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }
};

export default userService;