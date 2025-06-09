import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ForcedChoiceProps {
  optionA: string;
  optionB: string;
  selected: 'a' | 'b' | null;
  onSelect: (option: 'a' | 'b') => void;
}

const ForcedChoice: React.FC<ForcedChoiceProps> = ({ optionA, optionB, selected, onSelect }) => {
  // Add keyboard shortcuts for A and B keys
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === '1') {
        onSelect('a');
      } else if (key === 'b' || key === '2') {
        onSelect('b');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSelect]);
  return (
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect('a')}
        className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left relative ${
          selected === 'a'
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
            selected === 'a'
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-300'
          }`}>
            {selected === 'a' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full text-white p-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </div>
          <div className="flex-1">
            <span className={`text-lg ${
              selected === 'a' ? 'text-primary-700 font-medium' : 'text-gray-700'
            }`}>
              {optionA}
            </span>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            selected === 'a' ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-500'
          }`}>
            A
          </span>
        </div>
      </motion.button>

      <div className="text-center text-sm text-gray-400 font-medium">OR</div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect('b')}
        className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left relative ${
          selected === 'b'
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
            selected === 'b'
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-300'
          }`}>
            {selected === 'b' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full text-white p-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </div>
          <div className="flex-1">
            <span className={`text-lg ${
              selected === 'b' ? 'text-primary-700 font-medium' : 'text-gray-700'
            }`}>
              {optionB}
            </span>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            selected === 'b' ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-500'
          }`}>
            B
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default ForcedChoice;