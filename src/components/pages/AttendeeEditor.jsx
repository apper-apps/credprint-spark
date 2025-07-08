import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import FormField from '@/components/molecules/FormField';
import attendeeService from '@/services/api/attendeeService';
import eventService from '@/services/api/eventService';
import { toast } from 'react-toastify';

const AttendeeEditor = () => {
  const { eventId, attendeeId } = useParams();
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const [attendeeData, eventData] = await Promise.all([
        attendeeService.getById(parseInt(attendeeId)),
        eventService.getById(parseInt(eventId))
      ]);
      setAttendee(attendeeData);
      setEvent(eventData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load attendee details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [attendeeId, eventId]);

  const handleFieldChange = (fieldName, value) => {
    setAttendee({
      ...attendee,
      customData: {
        ...attendee.customData,
        [fieldName]: value
      }
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttendee({
          ...attendee,
          photoUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedAttendee = await attendeeService.update(attendee.Id, attendee);
      setAttendee(updatedAttendee);
      toast.success('Attendee updated successfully');
      navigate(`/events/${eventId}`);
    } catch (err) {
      toast.error('Failed to update attendee');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!attendee || !event) return <Error message="Attendee not found" />;

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Attendee</h1>
          <p className="text-gray-600 mt-1">
            Editing attendee for <span className="font-medium">{event.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(event.schema).map(([fieldName, fieldConfig]) => (
                  <FormField
                    key={fieldName}
                    label={fieldConfig.label}
                    type={fieldConfig.type}
                    required={fieldConfig.required}
                    value={attendee.customData[fieldName] || ''}
                    onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => navigate(`/events/${eventId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Photo Upload */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {attendee.photoUrl ? (
                    <img
                      src={attendee.photoUrl}
                      alt="Attendee"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ApperIcon name="User" className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Status</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={attendee.printStatus === 'printed' ? 'Check' : 'Clock'} 
                  className={`h-5 w-5 ${attendee.printStatus === 'printed' ? 'text-success' : 'text-warning'}`}
                />
                <span className="text-sm font-medium capitalize">
                  {attendee.printStatus.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(attendee.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendeeEditor;