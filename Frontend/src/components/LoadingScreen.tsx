import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const loadingMessages = [
    "Analyzing your responses...",
    "Calculating personality dimensions...",
    "Identifying cognitive patterns...",
    "Mapping your unique profile...",
    "Generating insights..."
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-secondary-200"
              animate={{ rotate: -360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-primary-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Processing Your Assessment
          </h2>
          
          <div className="space-y-2">
            {loadingMessages.map((message, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.5 }}
                className="text-gray-600"
              >
                {message}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-8 text-sm text-gray-500"
        >
          This may take a few moments...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;