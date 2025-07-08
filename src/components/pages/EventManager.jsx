import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import EventCard from '@/components/organisms/EventCard';
import SearchBar from '@/components/molecules/SearchBar';
import FormField from '@/components/molecules/FormField';
import eventService from '@/services/api/eventService';
import { toast } from 'react-toastify';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    location: '',
    schema: {
      name: { type: 'text', required: true, label: 'Full Name' },
      email: { type: 'email', required: true, label: 'Email Address' },
      company: { type: 'text', required: false, label: 'Company' }
    }
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await eventService.getAll();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        createdAt: new Date().toISOString(),
        attendees: []
      };
      
      const createdEvent = await eventService.create(eventData);
      setEvents([createdEvent, ...events]);
      setNewEvent({
        name: '',
        date: '',
        location: '',
        schema: {
          name: { type: 'text', required: true, label: 'Full Name' },
          email: { type: 'email', required: true, label: 'Email Address' },
          company: { type: 'text', required: false, label: 'Company' }
        }
      });
      setShowCreateForm(false);
      toast.success('Event created successfully');
    } catch (err) {
      toast.error('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.delete(eventId);
      setEvents(events.filter(event => event.Id !== eventId));
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEvents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage events for credential printing</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search events by name or location..."
          />
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Event Name"
                  required
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                />
                <FormField
                  label="Date"
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              
              <FormField
                label="Location"
                required
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Enter event location"
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No events found"
          description={searchTerm ? "Try adjusting your search criteria." : "Create your first event to start managing credentials and attendees."}
          actionText="Create Event"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard event={event} onDelete={handleDeleteEvent} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManager;