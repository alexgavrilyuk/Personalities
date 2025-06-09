import React from 'react';
import { SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface UniquenessAnalysisProps {
  uniqueness: any;
}

const UniquenessAnalysis: React.FC<UniquenessAnalysisProps> = ({ uniqueness }) => {
  if (!uniqueness) return null;

  const getRarityColor = (score: number) => {
    if (score >= 80) return 'text-purple-600 bg-purple-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">What Makes You Unique</h2>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {uniqueness.uniqueness_score}/100
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          Your personality combination is statistically {uniqueness.uniqueness_score > 70 ? 'rare' : 'balanced'},
          appearing in approximately {uniqueness.population_percentage}% of the population.
        </p>

        {/* Rare Trait Combinations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rare Trait Combinations</h3>
          <div className="space-y-3">
            {uniqueness.rare_combinations?.map((combo: any, idx: number) => (
              <div key={idx} className={`rounded-lg p-4 ${getRarityColor(combo.rarity_score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{combo.combination}</h4>
                  <span className="text-sm font-semibold">{combo.rarity_score}% rare</span>
                </div>
                <p className="text-sm">{combo.description}</p>
                <div className="mt-2 flex items-center text-xs">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  <span>Found in ~{combo.percentage}% of people</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Extremes */}
        {uniqueness.statistical_extremes?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Extremes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {uniqueness.statistical_extremes.map((extreme: any, idx: number) => (
                <div key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{extreme.trait}</span>
                    <span className="text-sm font-bold text-purple-600">
                      {extreme.percentile}th percentile
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{extreme.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Personality Archetype */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-3">Your Personality Archetype</h3>
          <div className="text-2xl font-bold mb-2">{uniqueness.archetype?.name || 'The Explorer'}</div>
          <p className="text-purple-100 mb-4">
            {uniqueness.archetype?.description || 'You represent a unique blend of traits that defies simple categorization.'}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-200">Strengths:</span>
              <p className="font-medium">{uniqueness.archetype?.strengths || 'Adaptability, Innovation'}</p>
            </div>
            <div>
              <span className="text-purple-200">Growth Edge:</span>
              <p className="font-medium">{uniqueness.archetype?.growth || 'Finding focus'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How You Compare */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How You Compare</h3>
        <div className="space-y-4">
          {uniqueness.comparison_insights?.map((insight: any, idx: number) => (
            <div key={idx} className="flex items-start">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniquenessAnalysis;