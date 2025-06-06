import React from 'react';
import { motion } from 'framer-motion';

interface VisualLikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  type: '7-point' | '5-point';
}

const VisualLikertScale: React.FC<VisualLikertScaleProps> = ({ value, onChange, type }) => {
  const options7 = [
    { value: 1, label: 'Strongly Disagree', color: 'from-red-500 to-red-600', emoji: '😠' },
    { value: 2, label: 'Disagree', color: 'from-orange-500 to-orange-600', emoji: '😕' },
    { value: 3, label: 'Slightly Disagree', color: 'from-yellow-500 to-yellow-600', emoji: '😐' },
    { value: 4, label: 'Neutral', color: 'from-gray-400 to-gray-500', emoji: '😶' },
    { value: 5, label: 'Slightly Agree', color: 'from-green-400 to-green-500', emoji: '🙂' },
    { value: 6, label: 'Agree', color: 'from-green-500 to-green-600', emoji: '😊' },
    { value: 7, label: 'Strongly Agree', color: 'from-green-600 to-green-700', emoji: '😄' }
  ];

  const options5 = [
    { value: 1, label: 'Never', color: 'from-red-500 to-red-600', emoji: '❌' },
    { value: 2, label: 'Rarely', color: 'from-orange-500 to-orange-600', emoji: '🔸' },
    { value: 3, label: 'Sometimes', color: 'from-yellow-500 to-yellow-600', emoji: '⚡' },
    { value: 4, label: 'Often', color: 'from-green-500 to-green-600', emoji: '✓' },
    { value: 5, label: 'Always', color: 'from-green-600 to-green-700', emoji: '✅' }
  ];

  const options = type === '7-point' ? options7 : options5;

  return (
    <div className="space-y-3">
      {/* Visual scale indicator */}
      <div className="relative h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full overflow-hidden">
        {value && (
          <motion.div
            className="absolute top-0 h-full w-1 bg-gray-800 rounded-full"
            initial={false}
            animate={{ left: `${((value - 1) / (options.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transform: 'translateX(-50%)' }}
          />
        )}
      </div>

      {/* Emoji buttons */}
      <div className="flex justify-between gap-1">
        {options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${
              value === option.value
                ? `bg-gradient-to-br ${option.color} shadow-lg`
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={option.label}
          >
            <span className={value === option.value ? 'grayscale-0' : 'grayscale opacity-60'}>
              {option.emoji}
            </span>
            {value === option.value && (
              <motion.div
                className="absolute inset-0 rounded-lg ring-2 ring-offset-2 ring-gray-800"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected label */}
      <div className="text-center h-6">
        {value && (
          <motion.p
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-gray-700"
          >
            {options.find(opt => opt.value === value)?.label}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default VisualLikertScale;