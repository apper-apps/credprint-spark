import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  permissions: [],
  roles: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
      
      // Extract permissions from user role
      if (action.payload?.role?.permissions) {
        const permissions = Array.isArray(action.payload.role.permissions) 
          ? action.payload.role.permissions 
          : JSON.parse(action.payload.role.permissions || '[]');
        state.permissions = permissions;
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
    },
    setRoles: (state, action) => {
      state.roles = action.payload || [];
    },
    addRole: (state, action) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(role => role.Id === action.payload.Id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    removeRole: (state, action) => {
      state.roles = state.roles.filter(role => role.Id !== action.payload);
    },
  },
});

export const { setUser, clearUser, setRoles, addRole, updateRole, removeRole } = userSlice.actions;
export default userSlice.reducer;