import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  icon = "Inbox", 
  title = "No items found", 
  description = "Get started by creating your first item.",
  actionText = "Create New",
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="bg-gradient-to-br from-accent/10 to-accent/20 rounded-full p-8 mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-accent" />
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-accent to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;