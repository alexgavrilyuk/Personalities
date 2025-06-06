import React from 'react';
import { motion } from 'framer-motion';
import { CognitiveFunctionStack } from '../../types/assessment';

interface CognitiveFunctionsProps {
  functions: CognitiveFunctionStack;
}

const CognitiveFunctions: React.FC<CognitiveFunctionsProps> = ({ functions }) => {
  const functionDescriptions: Record<string, { name: string; description: string }> = {
    'Ni': {
      name: 'Introverted Intuition',
      description: 'Sees patterns and connections, focuses on future insights and underlying meanings'
    },
    'Ne': {
      name: 'Extraverted Intuition',
      description: 'Explores possibilities and connections, generates new ideas and alternatives'
    },
    'Si': {
      name: 'Introverted Sensing',
      description: 'Recalls past experiences, values tradition and detailed memories'
    },
    'Se': {
      name: 'Extraverted Sensing',
      description: 'Lives in the present moment, aware of physical environment and experiences'
    },
    'Ti': {
      name: 'Introverted Thinking',
      description: 'Analyzes and categorizes, seeks logical consistency and understanding'
    },
    'Te': {
      name: 'Extraverted Thinking',
      description: 'Organizes the external world, focuses on efficiency and objective metrics'
    },
    'Fi': {
      name: 'Introverted Feeling',
      description: 'Evaluates based on personal values, seeks authenticity and inner harmony'
    },
    'Fe': {
      name: 'Extraverted Feeling',
      description: 'Considers group harmony, responds to others\' emotions and social dynamics'
    }
  };

  const getRoleDescription = (index: number): string => {
    const roles = ['Dominant', 'Auxiliary', 'Tertiary', 'Inferior'];
    return roles[index] || '';
  };

  const getColorClass = (level: number): string => {
    if (level >= 0.7) return 'bg-green-500';
    if (level >= 0.5) return 'bg-blue-500';
    if (level >= 0.3) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cognitive Function Stack</h2>
      
      <div className="space-y-6">
        {/* Primary Stack */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Function Hierarchy</h3>
          <div className="space-y-4">
            {functions.primary_stack.map((func, index) => {
              const level = functions.development_levels[func] || 0;
              const info = functionDescriptions[func];
              
              return (
                <motion.div
                  key={func}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-bold text-gray-800">{func}</span>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {getRoleDescription(index)}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-700">{info?.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{info?.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round(level * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Development</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${level * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className={`h-full ${getColorClass(level)}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Shadow Functions */}
        {functions.shadow_functions && functions.shadow_functions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Shadow Functions</h3>
            <p className="text-sm text-gray-600 mb-4">
              These represent less conscious aspects of your personality that may emerge under stress or during personal growth.
            </p>
            <div className="flex flex-wrap gap-3">
              {functions.shadow_functions.map((func, index) => {
                const info = functionDescriptions[func];
                return (
                  <motion.div
                    key={func}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-gray-100 rounded-lg p-3"
                  >
                    <div className="font-semibold text-gray-700">{func}</div>
                    <div className="text-xs text-gray-600">{info?.name}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Development Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 rounded-lg p-4 mt-6"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Function Development Tip</h4>
          <p className="text-sm text-blue-800">
            Focus on strengthening your auxiliary function ({functions.primary_stack[1]}) to support your dominant function. 
            This creates better balance and reduces stress on your inferior function ({functions.primary_stack[3]}).
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CognitiveFunctions;