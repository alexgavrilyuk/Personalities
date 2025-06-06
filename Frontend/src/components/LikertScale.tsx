import React from 'react';
import { motion } from 'framer-motion';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  labels: string[];
}

const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange, labels }) => {
  const isMobile = window.innerWidth < 640;

  return (
    <div className="space-y-4">
      {/* Mobile view - stacked buttons */}
      {isMobile ? (
        <div className="space-y-2">
          {labels.map((label, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(index + 1)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                value === index + 1
                  ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{label}</span>
                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                  value === index + 1
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {value === index + 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full bg-white scale-50"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        /* Desktop view - horizontal scale */
        <div>
          <div className="flex justify-between mb-2">
            {labels.map((label, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(index + 1)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  value === index + 1
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-full border-2 mb-2 flex items-center justify-center transition-all ${
                  value === index + 1
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {value === index + 1 ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs text-center max-w-[80px] ${
                  value === index + 1 ? 'font-medium' : ''
                }`}>
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LikertScale;