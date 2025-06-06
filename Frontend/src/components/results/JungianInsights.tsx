import React from 'react';
import { motion } from 'framer-motion';
import { JungianDepth } from '../../types/assessment';

interface JungianInsightsProps {
  depth: JungianDepth;
}

const JungianInsights: React.FC<JungianInsightsProps> = ({ depth }) => {
  const getIntegrationLevel = (score: number): { label: string; color: string; description: string } => {
    if (score >= 0.75) return {
      label: 'Advanced Integration',
      color: 'text-green-600',
      description: 'High self-awareness and acceptance of all aspects of personality'
    };
    if (score >= 0.5) return {
      label: 'Active Integration',
      color: 'text-blue-600',
      description: 'Growing awareness of unconscious patterns and shadow aspects'
    };
    if (score >= 0.25) return {
      label: 'Emerging Awareness',
      color: 'text-yellow-600',
      description: 'Beginning to recognize projections and hidden aspects'
    };
    return {
      label: 'Early Development',
      color: 'text-orange-600',
      description: 'Opportunity to explore deeper self-awareness'
    };
  };

  const archetypeInfo: Record<string, { icon: string; description: string }> = {
    'Hero': { icon: '⚔️', description: 'Driven by courage and achievement' },
    'Caregiver': { icon: '❤️', description: 'Motivated by nurturing and support' },
    'Sage': { icon: '📚', description: 'Seeking wisdom and understanding' },
    'Creator': { icon: '🎨', description: 'Expressing through innovation and creation' },
    'Rebel': { icon: '⚡', description: 'Challenging norms and creating change' },
    'Jester': { icon: '🎭', description: 'Finding joy and lightness in life' },
    'Ruler': { icon: '👑', description: 'Creating order and taking responsibility' },
    'Explorer': { icon: '🧭', description: 'Seeking freedom and new experiences' },
    'Magician': { icon: '✨', description: 'Transforming reality and creating change' },
    'Innocent': { icon: '🌟', description: 'Maintaining faith and optimism' }
  };

  const shadowLevel = getIntegrationLevel(depth.shadow_integration);
  const primaryArchetype = depth.archetype_profile 
    ? Object.entries(depth.archetype_profile).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    : null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-full"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Depth Psychology Insights</h3>
      
      {/* Shadow Integration */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Shadow Integration</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`font-semibold ${shadowLevel.color}`}>
              {shadowLevel.label}
            </span>
            <span className="text-2xl font-bold text-gray-800">
              {Math.round(depth.shadow_integration * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${depth.shadow_integration * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
            />
          </div>
          <p className="text-xs text-gray-600">{shadowLevel.description}</p>
        </div>
      </div>

      {/* Primary Archetype */}
      {primaryArchetype && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Dominant Archetype</h4>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {archetypeInfo[primaryArchetype]?.icon || '🌟'}
              </span>
              <div>
                <h5 className="font-bold text-gray-800">The {primaryArchetype}</h5>
                <p className="text-sm text-gray-600">
                  {archetypeInfo[primaryArchetype]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individuation Stage */}
      {depth.individuation_stage && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Individuation Journey</h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-900">
                {depth.individuation_stage}
              </span>
              <span className="text-blue-600">
                🌱 Growing
              </span>
            </div>
            <p className="text-xs text-blue-800">
              Your journey toward psychological wholeness and self-realization
            </p>
          </div>
        </div>
      )}

      {/* Archetype Profile */}
      {depth.archetype_profile && Object.keys(depth.archetype_profile).length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <h5 className="text-xs font-semibold text-gray-600 mb-2">Archetype Influences</h5>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(depth.archetype_profile)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 4)
              .map(([archetype, strength], index) => (
                <motion.div
                  key={archetype}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <span>{archetypeInfo[archetype]?.icon || '✨'}</span>
                  <span className="text-gray-700">{archetype}</span>
                  <span className="text-gray-500">{Math.round(strength * 100)}%</span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JungianInsights;