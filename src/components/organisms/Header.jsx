import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/events') return 'Event Manager';
    if (path.includes('/events/') && path.includes('/template')) return 'Template Designer';
    if (path.includes('/events/') && path.includes('/print')) return 'Print Preview';
    if (path.includes('/events/') && path.includes('/attendees/')) return 'Attendee Editor';
    if (path.includes('/events/')) return 'Event Details';
    if (path === '/settings') return 'Settings';
    return 'CredPrint Pro';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview of all events and recent activity';
    if (path === '/events') return 'Manage your events and attendees';
    if (path.includes('/template')) return 'Design credential templates';
    if (path.includes('/print')) return 'Preview and print credentials';
    if (path.includes('/attendees/')) return 'Edit attendee information';
    if (path.includes('/events/')) return 'Manage event details and attendees';
    if (path === '/settings') return 'Application settings and preferences';
    return 'Professional event credential printing system';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 lg:ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {getPageDescription()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;