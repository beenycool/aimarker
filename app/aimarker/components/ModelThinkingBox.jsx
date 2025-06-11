import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Add this new component
const MotionListItem = forwardRef(({ children, ...props }, ref) => (
  <motion.li ref={ref} {...props}>
    {children}
  </motion.li>
));
MotionListItem.displayName = 'MotionListItem';

// Component for displaying the Model Thinking Process
export const ModelThinkingBox = ({ thinking, loading }) => {
  // If loading and no thinking content yet, show a generic loading message
  if (loading && (!thinking || thinking.length === 0)) {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Model is thinking...</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait while the AI processes your request.</p>
      </div>
    );
  }

  // If there is thinking content, display it
  return (
    <AnimatePresence>
      {(thinking && thinking.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-3">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Model Thinking Process</h3>
          </div>
          <ScrollArea className="h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 text-sm">
            <ul className="space-y-1.5 text-gray-700 dark:text-gray-300">
              {thinking.map((thought, index) => (
                <MotionListItem
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{thought}</span>
                </MotionListItem>
              ))}
            </ul>
          </ScrollArea>
          {loading && (
            <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              Still processing...
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 