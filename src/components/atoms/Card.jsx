import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Card = forwardRef(({ 
  className = "",
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-lg shadow-enterprise border border-gray-200 transition-all duration-200";
  const hoverClasses = "hover:shadow-enterprise-lg hover:scale-[1.02]";

  if (hover) {
    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, hoverClasses, className)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;