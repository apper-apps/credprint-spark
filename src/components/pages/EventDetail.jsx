import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import AttendeeTable from '@/components/organisms/AttendeeTable';
import FormField from '@/components/molecules/FormField';
import eventService from '@/services/api/eventService';
import attendeeService from '@/services/api/attendeeService';
import { toast } from 'react-toastify';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAttendee, setNewAttendee] = useState({
    customData: {}
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const [eventData, attendeeData] = await Promise.all([
        eventService.getById(parseInt(id)),
        attendeeService.getByEventId(parseInt(id))
      ]);
      setEvent(eventData);
      setAttendees(attendeeData);
      
      // Initialize form with event schema
      if (eventData?.schema) {
        const initialData = {};
        Object.keys(eventData.schema).forEach(key => {
          initialData[key] = '';
        });
        setNewAttendee({ customData: initialData });
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

const handleAddAttendee = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = Object.entries(event.schema)
      .filter(([_, config]) => config.required)
      .map(([fieldName, _]) => fieldName);
    
    const missingFields = requiredFields.filter(field => 
      !newAttendee.customData[field] || newAttendee.customData[field].trim() === ''
    );
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    try {
      const attendeeData = {
        eventId: parseInt(id),
        customData: { ...newAttendee.customData },
        photoUrl: '',
        printStatus: 'not-printed',
        createdAt: new Date().toISOString()
      };
      
      const createdAttendee = await attendeeService.create(attendeeData);
      setAttendees(prev => [...prev, createdAttendee]);
      
      // Reset form with fresh state
      const initialData = {};
      Object.keys(event.schema).forEach(key => {
        initialData[key] = '';
      });
      setNewAttendee({ customData: initialData });
      setShowAddForm(false);
      toast.success('Attendee added successfully');
    } catch (err) {
      toast.error('Failed to add attendee: ' + err.message);
    }
  };

const handleDeleteAttendee = async (attendeeId) => {
    if (!confirm('Are you sure you want to delete this attendee? This action cannot be undone.')) return;
    
    try {
      await attendeeService.delete(attendeeId);
      setAttendees(prev => prev.filter(a => a.Id !== attendeeId));
      toast.success('Attendee deleted successfully');
    } catch (err) {
      toast.error('Failed to delete attendee: ' + err.message);
    }
  };

const handleFieldChange = (fieldName, value) => {
    setNewAttendee(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [fieldName]: value
      }
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!event) return <Error message="Event not found" />;

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link to="/events">
              <Button variant="ghost" size="sm">
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <div className="flex items-center space-x-4 text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MapPin" className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={`/events/${event.Id}/template`}>
            <Button variant="secondary">
              <ApperIcon name="Layout" className="h-4 w-4 mr-2" />
              Template
            </Button>
          </Link>
          <Link to={`/events/${event.Id}/print`}>
            <Button variant="accent">
              <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
              Print
            </Button>
          </Link>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-3xl font-bold text-primary">{attendees.length}</p>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-3 rounded-full">
              <ApperIcon name="Users" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Printed</p>
              <p className="text-3xl font-bold text-accent">
                {attendees.filter(a => a.printStatus === 'printed').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-accent/10 to-emerald-100 p-3 rounded-full">
              <ApperIcon name="Check" className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-warning">
                {attendees.filter(a => a.printStatus === 'not-printed').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-warning/10 to-yellow-100 p-3 rounded-full">
              <ApperIcon name="Clock" className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Attendees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Attendees</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Attendee
          </Button>
        </div>

        {/* Add Attendee Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Attendee</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleAddAttendee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(event.schema).map(([fieldName, fieldConfig]) => (
                    <FormField
                      key={fieldName}
                      label={fieldConfig.label}
                      type={fieldConfig.type}
                      required={fieldConfig.required}
                      value={newAttendee.customData[fieldName] || ''}
                      onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                      placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <Button type="submit" variant="primary">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Attendee
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Attendees Table */}
        {attendees.length === 0 ? (
          <Empty
            icon="Users"
            title="No attendees yet"
            description="Add your first attendee to start managing credentials for this event."
            actionText="Add Attendee"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <AttendeeTable
            attendees={attendees}
            eventId={event.Id}
            onDelete={handleDeleteAttendee}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetail;