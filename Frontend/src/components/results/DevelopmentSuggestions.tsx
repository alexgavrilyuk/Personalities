import React from 'react';
import { motion } from 'framer-motion';

interface DevelopmentSuggestionsProps {
  suggestions: string[];
}

const DevelopmentSuggestions: React.FC<DevelopmentSuggestionsProps> = ({ suggestions }) => {
  const icons = ['🎯', '🌟', '🚀', '💡', '🌱'];
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600'
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Personal Growth Path</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Based on your unique personality profile, here are personalized suggestions to support your continued growth and development.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className={`h-2 bg-gradient-to-r ${colors[index % colors.length]}`} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} 
                                flex items-center justify-center text-2xl text-white shadow-lg flex-shrink-0`}>
                  {icons[index % icons.length]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Growth Opportunity {index + 1}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mt-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Reflect</h4>
            <p className="text-sm text-gray-600">
              Choose one suggestion that resonates most with you right now
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Plan</h4>
            <p className="text-sm text-gray-600">
              Set a small, achievable goal for the next week
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Act</h4>
            <p className="text-sm text-gray-600">
              Take one small step today toward your growth
            </p>
          </div>
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-8"
      >
        <blockquote className="text-xl md:text-2xl text-gray-700 font-light italic max-w-3xl mx-auto">
          "The privilege of a lifetime is to become who you truly are."
        </blockquote>
        <cite className="text-gray-500 mt-2 block">- Carl Jung</cite>
      </motion.div>
    </div>
  );
};

export default DevelopmentSuggestions;