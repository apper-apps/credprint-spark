import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Badge = forwardRef(({ 
  className = "",
  variant = "default",
  size = "md",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/20 to-green-100 text-green-800",
    warning: "bg-gradient-to-r from-warning/20 to-yellow-100 text-yellow-800",
    error: "bg-gradient-to-r from-error/20 to-red-100 text-red-800",
    info: "bg-gradient-to-r from-info/20 to-blue-100 text-blue-800",
    primary: "bg-gradient-to-r from-primary/20 to-blue-100 text-blue-800",
    accent: "bg-gradient-to-r from-accent/20 to-emerald-100 text-emerald-800"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;