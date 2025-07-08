import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import EventCard from "@/components/organisms/EventCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Settings from "@/components/pages/Settings";
import eventService from "@/services/api/eventService";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAll();
      
      // Parse event data from database
      const parsedEvents = data.map(event => ({
        ...event,
        name: event.Name,
        schema: typeof event.schema === 'string' ? JSON.parse(event.schema) : event.schema || {},
        attendees: [] // Will be loaded separately if needed
      }));
      
      setEvents(parsedEvents);
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

  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
  const totalPrinted = events.reduce((sum, event) => 
    sum + (event.attendees?.filter(a => a.printStatus === 'printed').length || 0), 0
  );
  const recentEvents = events.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {totalEvents}
                </p>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-3 rounded-full">
                <ApperIcon name="Calendar" className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-accent to-emerald-600 bg-clip-text text-transparent">
                  {totalAttendees}
                </p>
              </div>
              <div className="bg-gradient-to-r from-accent/10 to-emerald-100 p-3 rounded-full">
                <ApperIcon name="Users" className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credentials Printed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent">
                  {totalPrinted}
                </p>
              </div>
              <div className="bg-gradient-to-r from-success/10 to-green-100 p-3 rounded-full">
                <ApperIcon name="Printer" className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <ApperIcon name="Zap" className="h-5 w-5 text-warning" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/events">
              <Button variant="primary">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline">
                <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <Link to="/events">
            <Button variant="outline">
              <span>View All</span>
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No events yet"
            description="Create your first event to start managing credentials and attendees."
            actionText="Create Event"
            onAction={() => window.location.href = '/events'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <EventCard event={event} onDelete={handleDeleteEvent} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;