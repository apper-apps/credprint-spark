import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({ 
  className = "",
  error = false,
  children,
  ...props 
}, ref) => {
  const baseClasses = "block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200";
  const errorClasses = "border-error focus:ring-error/50 focus:border-error";

  return (
    <select
      ref={ref}
      className={cn(
        baseClasses,
        error && errorClasses,
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;