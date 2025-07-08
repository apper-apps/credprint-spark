import { useEffect, useRef } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const CredentialPreview = ({ attendee, template, event }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !attendee || !template) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = template.dimensions?.width || 400;
    canvas.height = template.dimensions?.height || 250;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw header background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 60);

    // Draw event name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(event?.name || 'Event Name', canvas.width / 2, 35);

    // Draw attendee name
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(attendee.customData.name || 'Attendee Name', canvas.width / 2, 120);

    // Draw attendee details
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(attendee.customData.email || 'attendee@example.com', canvas.width / 2, 150);
    ctx.fillText(attendee.customData.company || 'Company Name', canvas.width / 2, 175);

    // Draw photo placeholder
    if (attendee.photoUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(80, 140, 40, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 40, 100, 80, 80);
        ctx.restore();
      };
      img.src = attendee.photoUrl;
    } else {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(40, 100, 80, 80);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Photo', 80, 145);
    }

  }, [attendee, template, event]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Credential Preview</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Eye" className="h-4 w-4" />
          <span>Live Preview</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg shadow-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
            <ApperIcon name="CreditCard" className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <span>ID: {attendee.Id}</span>
          <span>•</span>
          <span>Status: {attendee.printStatus}</span>
          <span>•</span>
          <span>{template.dimensions?.width || 400} x {template.dimensions?.height || 250}px</span>
        </div>
      </div>
    </Card>
  );
};

export default CredentialPreview;