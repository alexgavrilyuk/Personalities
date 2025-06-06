import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, percentage }) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div className={`${isMobile ? 'mb-4' : 'mb-8'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
          Progress
        </span>
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
          {Math.round(percentage * 100)}%
        </span>
      </div>
      <div className={`w-full ${isMobile ? 'h-2' : 'h-3'} bg-gray-200 rounded-full overflow-hidden`}>
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        About {Math.ceil((1 - percentage) * 20)} minutes remaining
      </div>
    </div>
  );
};

export default ProgressBar;