import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const Sidebar = () => {
  const { user, canAccessEvents } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'BarChart3' },
    ...(canAccessEvents() ? [{ path: '/events', label: 'Events', icon: 'Calendar' }] : []),
    ...(user?.role?.permissions?.includes('*') || user?.role?.permissions?.includes('users:read') ? [{ path: '/users', label: 'User Management', icon: 'Users' }] : []),
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ];
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-lg">
            <ApperIcon name="CreditCard" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              CredPrint Pro
            </h1>
            <p className="text-gray-400 text-sm">Event Credentials</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

<div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <div className="w-8 h-8 bg-gradient-to-r from-accent to-emerald-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-300">{user?.name || 'Loading...'}</p>
            <div className="flex items-center space-x-2">
              {user?.role && (
                <Badge 
                  className="text-xs px-2 py-0.5" 
                  style={{ 
                    backgroundColor: user.role.color + '20', 
                    color: user.role.color,
                    border: `1px solid ${user.role.color}40`
                  }}
                >
                  {user.role.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 w-64 h-full z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;