import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface TeamStrengthsProps {
  strengths: any[];
  blindSpots: any[];
  suggestions: any[];
}

const TeamStrengths: React.FC<TeamStrengthsProps> = ({ strengths, blindSpots, suggestions }) => {
  return (
    <div className="space-y-6">
      {/* Strengths Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Team Strengths</h2>
        </div>
        <div className="space-y-4">
          {strengths.map((strength, idx) => (
            <div key={idx} className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">{strength.strength}</h3>
              <p className="text-gray-700 mb-3">{strength.description}</p>
              <div className="bg-white rounded p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">How to leverage:</p>
                <p className="text-sm text-gray-600">{strength.leverage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blind Spots Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <ExclamationCircleIcon className="w-6 h-6 text-amber-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Blind Spots & Growth Areas</h2>
        </div>
        <div className="space-y-4">
          {blindSpots.map((spot, idx) => (
            <div key={idx} className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">{spot.blind_spot}</h3>
              <p className="text-gray-700 mb-3">{spot.description}</p>
              <div className="bg-white rounded p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Impact:</p>
                <p className="text-sm text-gray-600 mb-3">{spot.impact}</p>
                <p className="text-sm font-medium text-gray-700 mb-1">Mitigation:</p>
                <p className="text-sm text-gray-600">{spot.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <LightBulbIcon className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Collaboration Tips</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-medium text-sm">{idx + 1}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900 mb-1">{suggestion.category}</h4>
                  <p className="text-sm text-gray-700 mb-2">{suggestion.tip}</p>
                  <p className="text-xs text-gray-600 italic">Why: {suggestion.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamStrengths;