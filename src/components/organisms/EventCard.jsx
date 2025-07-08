import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const EventCard = ({ event, onDelete }) => {
  const attendeeCount = event.attendees?.length || 0;
  const printedCount = event.attendees?.filter(a => a.printStatus === 'printed').length || 0;

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MapPin" className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <Badge variant={attendeeCount > 0 ? "success" : "default"}>
          {attendeeCount > 0 ? "Active" : "Setup"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">{attendeeCount}</div>
          <div className="text-sm text-gray-600">Attendees</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-emerald-100 rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">{printedCount}</div>
          <div className="text-sm text-gray-600">Printed</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link to={`/events/${event.Id}`}>
          <Button variant="primary" size="sm">
            <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link to={`/events/${event.Id}/template`}>
            <Button variant="secondary" size="sm">
              <ApperIcon name="Layout" className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/events/${event.Id}/print`}>
            <Button variant="accent" size="sm">
              <ApperIcon name="Printer" className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(event.Id)}
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;