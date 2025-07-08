import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ 
  className = "",
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200";
  const errorClasses = "border-error focus:ring-error/50 focus:border-error";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        error && errorClasses,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;