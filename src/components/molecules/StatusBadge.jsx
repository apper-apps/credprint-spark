import Badge from '@/components/atoms/Badge';

const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    active: { variant: "success", text: "Active" },
    inactive: { variant: "default", text: "Inactive" },
    pending: { variant: "warning", text: "Pending" },
    printed: { variant: "success", text: "Printed" },
    "not-printed": { variant: "default", text: "Not Printed" },
    error: { variant: "error", text: "Error" }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};

export default StatusBadge;