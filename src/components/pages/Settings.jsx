import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, users, roles, canManageUsers, canManageRoles, loadUsers, loadRoles, createUser, updateUser, deleteUser } = useUser();
  const [activeTab, setActiveTab] = useState('general');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  
  const [settings, setSettings] = useState({
    general: {
      appName: 'CredPrint Pro',
      defaultCredentialSize: 'standard',
      autoSave: true,
      showPreview: true
    },
    printing: {
      defaultPrinter: 'default',
      printQuality: 'high',
      paperSize: 'A4',
      orientation: 'portrait'
    },
    notifications: {
      emailNotifications: true,
      printNotifications: true,
      errorNotifications: true
    }
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    roleId: '',
    status: 'active'
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    permissions: []
  });

  const availablePermissions = [
    { id: 'events:read', label: 'View Events', category: 'Events' },
    { id: 'events:write', label: 'Manage Events', category: 'Events' },
    { id: 'attendees:read', label: 'View Attendees', category: 'Attendees' },
    { id: 'attendees:write', label: 'Manage Attendees', category: 'Attendees' },
    { id: 'templates:read', label: 'View Templates', category: 'Templates' },
    { id: 'templates:write', label: 'Manage Templates', category: 'Templates' },
    { id: 'users:read', label: 'View Users', category: 'Users' },
    { id: 'users:write', label: 'Manage Users', category: 'Users' },
    { id: 'roles:read', label: 'View Roles', category: 'Roles' },
    { id: 'roles:write', label: 'Manage Roles', category: 'Roles' },
    { id: '*', label: 'Administrator (All Permissions)', category: 'System' }
  ];

  useEffect(() => {
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    ...(canManageUsers() ? [{ id: 'users', label: 'Users', icon: 'Users' }] : []),
    ...(canManageRoles() ? [{ id: 'roles', label: 'Roles', icon: 'Shield' }] : [])
  ];

const handleSaveSettings = () => {
    localStorage.setItem('credprint-settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        general: {
          appName: 'CredPrint Pro',
          defaultCredentialSize: 'standard',
          autoSave: true,
          showPreview: true
        },
        printing: {
          defaultPrinter: 'default',
          printQuality: 'high',
          paperSize: 'A4',
          orientation: 'portrait'
        },
        notifications: {
          emailNotifications: true,
          printNotifications: true,
          errorNotifications: true
        }
      });
      toast.success('Settings reset to default');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(userForm);
      setShowUserModal(false);
      setUserForm({ name: '', email: '', roleId: '', status: 'active' });
      loadUsers();
    } catch (error) {
      // Error already handled in context
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.Id, userForm);
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', roleId: '', status: 'active' });
      loadUsers();
    } catch (error) {
      // Error already handled in context
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (error) {
      // Error already handled in context
    }
  };

  const openUserModal = (userToEdit = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setUserForm({
        name: userToEdit.name,
        email: userToEdit.email,
        roleId: userToEdit.roleId,
        status: userToEdit.status
      });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', roleId: '', status: 'active' });
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', roleId: '', status: 'active' });
  };

  const getRoleColor = (role) => {
    switch (role.name) {
      case 'Administrator': return 'bg-red-100 text-red-800';
      case 'Event Manager': return 'bg-blue-100 text-blue-800';
      case 'Viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionsByCategory = () => {
    const grouped = {};
    availablePermissions.forEach(perm => {
      if (!grouped[perm.category]) grouped[perm.category] = [];
      grouped[perm.category].push(perm);
    });
    return grouped;
  };

return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application preferences and configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-2 rounded-lg">
                <ApperIcon name="Settings" className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">General</h3>
            </div>

            <div className="space-y-4">
              <FormField
                label="Application Name"
                value={settings.general.appName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, appName: e.target.value }
                })}
              />

              <FormField
                label="Default Credential Size"
                type="select"
                value={settings.general.defaultCredentialSize}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, defaultCredentialSize: e.target.value }
                })}
                options={[
                  { value: 'standard', label: 'Standard (400x250)' },
                  { value: 'large', label: 'Large (500x300)' },
                  { value: 'small', label: 'Small (300x200)' }
                ]}
              />

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.general.autoSave}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, autoSave: e.target.checked }
                    })}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Auto-save changes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.general.showPreview}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, showPreview: e.target.checked }
                    })}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Show live preview</span>
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Printing Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-accent/10 to-emerald-100 p-2 rounded-lg">
                <ApperIcon name="Printer" className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Printing</h3>
            </div>

            <div className="space-y-4">
              <FormField
                label="Default Printer"
                type="select"
                value={settings.printing.defaultPrinter}
                onChange={(e) => setSettings({
                  ...settings,
                  printing: { ...settings.printing, defaultPrinter: e.target.value }
                })}
                options={[
                  { value: 'default', label: 'System Default' },
                  { value: 'hp-laserjet', label: 'HP LaserJet' },
                  { value: 'canon-pixma', label: 'Canon PIXMA' }
                ]}
              />

              <FormField
                label="Print Quality"
                type="select"
                value={settings.printing.printQuality}
                onChange={(e) => setSettings({
                  ...settings,
                  printing: { ...settings.printing, printQuality: e.target.value }
                })}
                options={[
                  { value: 'high', label: 'High Quality' },
                  { value: 'medium', label: 'Medium Quality' },
                  { value: 'draft', label: 'Draft Quality' }
                ]}
              />

              <FormField
                label="Paper Size"
                type="select"
                value={settings.printing.paperSize}
                onChange={(e) => setSettings({
                  ...settings,
                  printing: { ...settings.printing, paperSize: e.target.value }
                })}
                options={[
                  { value: 'A4', label: 'A4' },
                  { value: 'Letter', label: 'Letter' },
                  { value: 'Legal', label: 'Legal' }
                ]}
              />

              <FormField
                label="Orientation"
                type="select"
                value={settings.printing.orientation}
                onChange={(e) => setSettings({
                  ...settings,
                  printing: { ...settings.printing, orientation: e.target.value }
                })}
                options={[
                  { value: 'portrait', label: 'Portrait' },
                  { value: 'landscape', label: 'Landscape' }
                ]}
              />
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-warning/10 to-yellow-100 p-2 rounded-lg">
                <ApperIcon name="Bell" className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Print Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.printNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, printNotifications: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Error Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.errorNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, errorNotifications: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </label>
            </div>
          </Card>
        </motion.div>
</div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Save Settings</h3>
                <p className="text-sm text-gray-600">Save your changes or reset to defaults</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={handleResetSettings}
                >
                  <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                >
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && canManageUsers() && (
        <div className="space-y-6">
          {/* Users Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600">Manage users and their access permissions</p>
            </div>
            <Button onClick={() => openUserModal()} variant="primary">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Search */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userItem) => (
              <motion.div
                key={userItem.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{userItem.name}</h3>
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                      </div>
                    </div>
                    <Badge className={getRoleColor(userItem.role)}>
                      {userItem.role.name}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={userItem.status === 'active' ? 'success' : 'error'}>
                        {userItem.status}
                      </Badge>
                    </div>
                    {userItem.lastLogin && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="text-gray-900">
                          {new Date(userItem.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUserModal(userItem)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {userItem.Id !== user?.Id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(userItem.Id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && canManageRoles() && (
        <div className="space-y-6">
          {/* Roles Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
              <p className="text-sm text-gray-600">Define roles and their permissions</p>
            </div>
            <Button onClick={() => setShowRoleModal(true)} variant="primary">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <motion.div
                key={role.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: role.color + '20' }}
                      >
                        <ApperIcon name="Shield" className="h-5 w-5" style={{ color: role.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.includes('*') ? (
                        <Badge className="bg-red-100 text-red-800">All Permissions</Badge>
                      ) : (
                        role.permissions.map((perm) => (
                          <Badge key={perm} className="bg-blue-100 text-blue-800 text-xs">
                            {perm}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Users with this role:</span>
                    <span className="font-medium">
                      {users.filter(u => u.roleId === role.Id).length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {role.name !== 'Administrator' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create User'}
                </h3>
                <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600">
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                <FormField
                  label="Name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                />
                
                <FormField
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />

                <FormField
                  label="Role"
                  type="select"
                  value={userForm.roleId}
                  onChange={(e) => setUserForm({...userForm, roleId: parseInt(e.target.value)})}
                  options={roles.map(role => ({ value: role.Id, label: role.name }))}
                  required
                />

                <FormField
                  label="Status"
                  type="select"
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />

                <div className="flex items-center space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingUser ? 'Update User' : 'Create User'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeUserModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;