import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import { toast } from 'react-toastify';

const Settings = () => {
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

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application preferences and configuration</p>
      </div>

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
    </div>
  );
};

export default Settings;