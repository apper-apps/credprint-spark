import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import FormField from '@/components/molecules/FormField';
import eventService from '@/services/api/eventService';
import templateService from '@/services/api/templateService';
import { toast } from 'react-toastify';

const TemplateDesigner = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [templateData, setTemplateData] = useState({
    name: '',
    dimensions: {
      width: 400,
      height: 250
    },
    design: {
      backgroundColor: '#ffffff',
      headerColor: '#2563eb',
      textColor: '#1f2937',
      accentColor: '#10b981'
    }
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const eventData = await eventService.getById(parseInt(eventId));
      setEvent(eventData);
      
      if (eventData.templateId) {
        const templateData = await templateService.getById(eventData.templateId);
        setTemplate(templateData);
        setTemplateData(templateData);
      } else {
        setTemplateData({
          ...templateData,
          name: `${eventData.name} Template`
        });
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load template data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleSaveTemplate = async () => {
    try {
      let savedTemplate;
      if (template) {
        savedTemplate = await templateService.update(template.Id, templateData);
      } else {
        savedTemplate = await templateService.create(templateData);
        // Update event with template ID
        await eventService.update(parseInt(eventId), {
          ...event,
          templateId: savedTemplate.Id
        });
      }
      
      setTemplate(savedTemplate);
      toast.success('Template saved successfully');
    } catch (err) {
      toast.error('Failed to save template');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!event) return <Error message="Event not found" />;

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
          <h1 className="text-3xl font-bold text-gray-900">Template Designer</h1>
          <p className="text-gray-600 mt-1">
            Design credential template for <span className="font-medium">{event.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="primary" onClick={handleSaveTemplate}>
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Link to={`/events/${eventId}/print`}>
            <Button variant="accent">
              <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h3>
            <div className="space-y-4">
              <FormField
                label="Template Name"
                value={templateData.name}
                onChange={(e) => setTemplateData({
                  ...templateData,
                  name: e.target.value
                })}
                placeholder="Enter template name"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Width (px)"
                  type="number"
                  value={templateData.dimensions.width}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    dimensions: {
                      ...templateData.dimensions,
                      width: parseInt(e.target.value) || 400
                    }
                  })}
                />
                <FormField
                  label="Height (px)"
                  type="number"
                  value={templateData.dimensions.height}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    dimensions: {
                      ...templateData.dimensions,
                      height: parseInt(e.target.value) || 250
                    }
                  })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={templateData.design.backgroundColor}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    design: {
                      ...templateData.design,
                      backgroundColor: e.target.value
                    }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Color
                </label>
                <input
                  type="color"
                  value={templateData.design.headerColor}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    design: {
                      ...templateData.design,
                      headerColor: e.target.value
                    }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={templateData.design.textColor}
                  onChange={(e) => setTemplateData({
                    ...templateData,
                    design: {
                      ...templateData.design,
                      textColor: e.target.value
                    }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Eye" className="h-4 w-4" />
                <span>Live Preview</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  className="shadow-print-preview rounded-lg overflow-hidden"
                  style={{
                    width: `${templateData.dimensions.width}px`,
                    height: `${templateData.dimensions.height}px`,
                    backgroundColor: templateData.design.backgroundColor
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      backgroundColor: templateData.design.headerColor,
                      height: '60px'
                    }}
                  >
                    {event.name}
                  </div>

                  {/* Content Area */}
                  <div className="p-6 relative">
                    {/* Photo Area */}
                    <div className="absolute left-6 top-6 w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Text Content */}
                    <div className="ml-28 space-y-2">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: templateData.design.textColor }}
                      >
                        Attendee Name
                      </div>
                      <div
                        className="text-sm opacity-75"
                        style={{ color: templateData.design.textColor }}
                      >
                        attendee@example.com
                      </div>
                      <div
                        className="text-sm opacity-75"
                        style={{ color: templateData.design.textColor }}
                      >
                        Company Name
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  <ApperIcon name="CreditCard" className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-4">
                <span>Size: {templateData.dimensions.width} x {templateData.dimensions.height}px</span>
                <span>•</span>
                <span>Template: {templateData.name}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesigner;