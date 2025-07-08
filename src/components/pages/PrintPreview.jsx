import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import CredentialPreview from '@/components/organisms/CredentialPreview';
import eventService from '@/services/api/eventService';
import attendeeService from '@/services/api/attendeeService';
import templateService from '@/services/api/templateService';
import { toast } from 'react-toastify';

const PrintPreview = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [printing, setPrinting] = useState(false);

const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventData, attendeeData] = await Promise.all([
        eventService.getById(parseInt(eventId)),
        attendeeService.getByEventId(parseInt(eventId))
      ]);
      
      // Parse event data from database
      const parsedEvent = {
        ...eventData,
        name: eventData.Name
      };
      
      setEvent(parsedEvent);
      setAttendees(attendeeData);
      
      if (eventData.template_id) {
        const templateData = await templateService.getById(eventData.template_id);
        
        // Parse template data from database
        const parsedTemplate = {
          ...templateData,
          name: templateData.Name,
          dimensions: typeof templateData.dimensions === 'string' ? JSON.parse(templateData.dimensions) : templateData.dimensions,
          design: typeof templateData.design === 'string' ? JSON.parse(templateData.design) : templateData.design
        };
        
        setTemplate(parsedTemplate);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load print preview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleSelectAll = () => {
    if (selectedAttendees.length === attendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(attendees.map(a => a.Id));
    }
  };

  const handleSelectAttendee = (attendeeId) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const handlePrint = async () => {
    if (selectedAttendees.length === 0) {
      toast.warning('Please select at least one attendee to print');
      return;
    }

    setPrinting(true);
    try {
      // Update print status for selected attendees using API
      const updatePromises = selectedAttendees.map(async (attendeeId) => {
        const attendee = attendees.find(a => a.Id === attendeeId);
        if (attendee) {
          const customData = typeof attendee.custom_data === 'string' ? JSON.parse(attendee.custom_data) : attendee.custom_data || {};
          return await attendeeService.update(attendeeId, {
            customData,
            photoUrl: attendee.photo_url,
            printStatus: 'printed',
            eventId: parseInt(eventId)
          });
        }
      });
      
      await Promise.all(updatePromises);
      
      // Update local state
      const updatedAttendees = attendees.map(attendee => 
        selectedAttendees.includes(attendee.Id)
          ? { ...attendee, print_status: 'printed' }
          : attendee
      );
      
      setAttendees(updatedAttendees);
      setSelectedAttendees([]);
      
      toast.success(`Successfully printed ${selectedAttendees.length} credential(s)`);
    } catch (err) {
      toast.error('Failed to print credentials');
    } finally {
      setPrinting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!event) return <Error message="Event not found" />;

  const selectedAttendeesData = attendees.filter(a => selectedAttendees.includes(a.Id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link to={`/events/${eventId}`}>
              <Button variant="ghost" size="sm">
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back to Event
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Print Preview</h1>
<p className="text-gray-600 mt-1">
            Preview and print credentials for <span className="font-medium">{event.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={`/events/${eventId}/template`}>
            <Button variant="secondary">
              <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
          </Link>
          <Button
            variant="accent"
            onClick={handlePrint}
            disabled={printing || selectedAttendees.length === 0}
          >
            {printing ? (
              <>
                <ApperIcon name="Loader" className="h-4 w-4 mr-2 animate-spin" />
                Printing...
              </>
            ) : (
              <>
                <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
                Print Selected ({selectedAttendees.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Print Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Print Controls</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {selectedAttendees.length} of {attendees.length} selected
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedAttendees.length === attendees.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {attendees.map((attendee) => (
            <motion.div
              key={attendee.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedAttendees.includes(attendee.Id)
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectAttendee(attendee.Id)}
            >
<div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {attendee.photo_url ? (
                    <img src={attendee.photo_url} alt="Attendee" className="w-full h-full object-cover" />
                  ) : (
                    <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {(() => {
                      const customData = typeof attendee.custom_data === 'string' ? JSON.parse(attendee.custom_data) : attendee.custom_data || {};
                      return customData.name || attendee.Name || 'No Name';
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {(() => {
                      const customData = typeof attendee.custom_data === 'string' ? JSON.parse(attendee.custom_data) : attendee.custom_data || {};
                      return customData.email || 'No Email';
                    })()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {(attendee.print_status || attendee.printStatus) === 'printed' && (
                    <ApperIcon name="Check" className="h-4 w-4 text-success" />
                  )}
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(attendee.Id)}
                    onChange={() => handleSelectAttendee(attendee.Id)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Preview Area */}
      {selectedAttendeesData.length === 0 ? (
        <Empty
          icon="Printer"
          title="No attendees selected"
          description="Select attendees from the list above to preview their credentials."
          actionText="Select All"
          onAction={handleSelectAll}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Preview Selected Credentials ({selectedAttendeesData.length})
            </h3>
            <div className="text-sm text-gray-600">
              {template ? `Template: ${template.name}` : 'No template selected'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedAttendeesData.map((attendee, index) => (
              <motion.div
                key={attendee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CredentialPreview
                  attendee={attendee}
                  template={template}
                  event={event}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintPreview;