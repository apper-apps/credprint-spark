import { motion } from 'framer-motion';

const Loading = ({ className = "" }) => {
  return (
    <div className={`p-8 ${className}`}>
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <motion.div
            className="h-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundSize: '200% 100%' }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded w-2/3"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-enterprise p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                style={{ backgroundSize: '200% 100%' }}
              />
              <div className="space-y-2">
                <motion.div
                  className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded w-3/4"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 + 0.2 }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <motion.div
                  className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded w-1/2"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 + 0.3 }}
                  style={{ backgroundSize: '200% 100%' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;