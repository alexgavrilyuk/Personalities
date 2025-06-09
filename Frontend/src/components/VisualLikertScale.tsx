import React from 'react';
import { motion } from 'framer-motion';

interface VisualLikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  type: '7-point' | '5-point';
}

const VisualLikertScale: React.FC<VisualLikertScaleProps> = ({ value, onChange, type }) => {
  const options7 = [
    { value: 1, label: 'Strongly Disagree', shortLabel: 'SD' },
    { value: 2, label: 'Disagree', shortLabel: 'D' },
    { value: 3, label: 'Slightly Disagree', shortLabel: 'SD' },
    { value: 4, label: 'Neutral', shortLabel: 'N' },
    { value: 5, label: 'Slightly Agree', shortLabel: 'SA' },
    { value: 6, label: 'Agree', shortLabel: 'A' },
    { value: 7, label: 'Strongly Agree', shortLabel: 'SA' }
  ];

  const options5 = [
    { value: 1, label: 'Never', shortLabel: 'N' },
    { value: 2, label: 'Rarely', shortLabel: 'R' },
    { value: 3, label: 'Sometimes', shortLabel: 'S' },
    { value: 4, label: 'Often', shortLabel: 'O' },
    { value: 5, label: 'Always', shortLabel: 'A' }
  ];

  const options = type === '7-point' ? options7 : options5;

  return (
    <div className="space-y-3">
      {/* Scale buttons */}
      <div className="flex justify-between gap-2">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 py-3 px-2 rounded-xl font-medium text-sm transition-all ${
              value === option.value
                ? 'bg-yellow-500 text-charcoal-800 shadow-sm'
                : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
            }`}
            title={option.label}
          >
            <span className="hidden sm:inline">{option.value}</span>
            <span className="sm:hidden">{option.shortLabel}</span>
            {value === option.value && (
              <motion.div
                className="absolute inset-0 rounded-xl ring-2 ring-yellow-600 ring-opacity-50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scale labels - only show on larger screens */}
      <div className="hidden sm:flex justify-between px-1">
        <span className="text-xs text-charcoal-500">{options[0].label}</span>
        {options.length === 7 && (
          <span className="text-xs text-charcoal-500">{options[3].label}</span>
        )}
        <span className="text-xs text-charcoal-500">{options[options.length - 1].label}</span>
      </div>

      {/* Selected label for mobile */}
      <div className="sm:hidden text-center h-5">
        {value && (
          <motion.p
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-charcoal-600"
          >
            {options.find(opt => opt.value === value)?.label}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default VisualLikertScale;