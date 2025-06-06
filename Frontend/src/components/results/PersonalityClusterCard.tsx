import React from 'react';
import { motion } from 'framer-motion';
import { PersonalityCluster } from '../../types/assessment';

interface PersonalityClusterCardProps {
  cluster: PersonalityCluster;
}

const PersonalityClusterCard: React.FC<PersonalityClusterCardProps> = ({ cluster }) => {
  const clusterInfo = [
    {
      name: 'Resilient',
      color: 'from-green-400 to-green-600',
      icon: '💪',
      description: 'Well-adapted across all personality dimensions with high emotional stability and social competence.'
    },
    {
      name: 'Overcontrolled',
      color: 'from-blue-400 to-blue-600',
      icon: '🎯',
      description: 'Careful and cautious with heightened emotional sensitivity and preference for structure.'
    },
    {
      name: 'Undercontrolled',
      color: 'from-orange-400 to-orange-600',
      icon: '🌊',
      description: 'Spontaneous and flexible with a preference for immediate experiences and adaptability.'
    },
    {
      name: 'Average',
      color: 'from-purple-400 to-purple-600',
      icon: '⚖️',
      description: 'Balanced traits without extreme tendencies, representing typical personality patterns.'
    }
  ];

  const currentCluster = clusterInfo[cluster.primary_cluster] || clusterInfo[3];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-full"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Personality Pattern</h3>
      
      <div className={`bg-gradient-to-br ${currentCluster.color} rounded-xl p-6 text-white mb-4`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{currentCluster.icon}</div>
          <h4 className="text-2xl font-bold mb-2">{cluster.cluster_description || currentCluster.name}</h4>
          <div className="text-lg font-semibold opacity-90">
            {Math.round(cluster.cluster_probabilities[cluster.primary_cluster] * 100)}% match
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        {currentCluster.description}
      </p>

      {/* Probability Distribution */}
      <div className="space-y-2">
        <h5 className="text-sm font-semibold text-gray-700 mb-2">Pattern Distribution</h5>
        {cluster.cluster_probabilities.map((prob, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-24">
              {clusterInfo[index]?.name || `Cluster ${index + 1}`}
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${clusterInfo[index]?.color || 'from-gray-400 to-gray-600'}`}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-12 text-right">
              {Math.round(prob * 100)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalityClusterCard;