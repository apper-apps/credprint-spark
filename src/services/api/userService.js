import mockUsers from '@/services/mockData/users.json';
import mockRoles from '@/services/mockData/roles.json';

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
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockRoles];
  },

  createRole: async (roleData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRole = {
      ...roleData,
      Id: Math.max(...mockRoles.map(r => r.Id)) + 1,
      createdAt: new Date().toISOString(),
      createdBy: 1 // Current user ID
    };
    mockRoles.push(newRole);
    return { ...newRole };
  },

  updateRole: async (id, roleData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockRoles.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Role not found');
    }
    const updatedRole = { ...mockRoles[index], ...roleData, Id: id };
    mockRoles[index] = updatedRole;
    
    // Update users with this role
    mockUsers.forEach(user => {
      if (user.roleId === id) {
        user.role = { ...updatedRole };
      }
    });
    
    return { ...updatedRole };
  },

  deleteRole: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockRoles.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Role not found');
    }
    
    // Check if any users have this role
    const usersWithRole = mockUsers.filter(u => u.roleId === id);
    if (usersWithRole.length > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    mockRoles.splice(index, 1);
    return true;
  },

  hasPermission: async (userId, permission) => {
    const user = mockUsers.find(u => u.Id === userId);
    if (!user || !user.role) return false;
    return user.role.permissions.includes(permission) || user.role.permissions.includes('*');
  }
};

export default userService;