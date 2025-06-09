import React from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface TraitInteractionsProps {
  interactions: any[];
  bigFiveScores: any;
}

const TraitInteractions: React.FC<TraitInteractionsProps> = ({ interactions, bigFiveScores }) => {
  const getTraitColor = (trait: string) => {
    const colors: Record<string, string> = {
      'Openness': 'bg-blue-100 text-blue-800',
      'Conscientiousness': 'bg-green-100 text-green-800',
      'Extraversion': 'bg-yellow-100 text-yellow-800',
      'Agreeableness': 'bg-purple-100 text-purple-800',
      'Neuroticism': 'bg-red-100 text-red-800'
    };
    return colors[trait] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How Your Traits Work Together
        </h2>
        <p className="text-gray-600 mb-6">
          Your personality traits don't exist in isolation—they interact to create unique patterns
          that shape your behavior, preferences, and potential.
        </p>

        <div className="space-y-6">
          {interactions.map((interaction, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTraitColor(interaction.trait1)}`}>
                    {interaction.trait1}
                  </span>
                  <ArrowsRightLeftIcon className="w-5 h-5 text-gray-400" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTraitColor(interaction.trait2)}`}>
                    {interaction.trait2}
                  </span>
                </div>
                <div className={`text-sm font-medium ${
                  interaction.strength === 'strong' ? 'text-purple-600' :
                  interaction.strength === 'moderate' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {interaction.strength} interaction
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{interaction.description}</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{interaction.implication}</p>
              </div>

              {interaction.examples && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Real-world examples:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {interaction.examples.map((example: string, exIdx: number) => (
                      <li key={exIdx} className="text-sm text-gray-600">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trait Balance Visualization */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Trait Balance</h3>
        <div className="space-y-4">
          {Object.entries(bigFiveScores).map(([trait, score]: [string, any]) => (
            <div key={trait} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700">{trait}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                  style={{ width: `${score}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">{score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraitInteractions;