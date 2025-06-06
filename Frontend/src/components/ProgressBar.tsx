import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, percentage }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(percentage * 100)}%
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        {Math.ceil((total - current) * 0.15)} minutes remaining
      </div>
    </div>
  );
};

export default ProgressBar;