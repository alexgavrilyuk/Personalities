import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface CommunicationMatrixProps {
  members: any[];
  communicationMap: any[];
}

const CommunicationMatrix: React.FC<CommunicationMatrixProps> = ({ members, communicationMap }) => {
  const [selectedPair, setSelectedPair] = useState<any>(null);

  // Create a map for quick lookup
  const communicationLookup = new Map();
  communicationMap.forEach(item => {
    const key = `${item.from_user}-${item.to_user}`;
    communicationLookup.set(key, item);
  });

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleCellClick = (fromMember: any, toMember: any) => {
    if (fromMember.user_id === toMember.user_id) return;
    
    const key = `${fromMember.user_name}-${toMember.user_name}`;
    const reverseKey = `${toMember.user_name}-${fromMember.user_name}`;
    const communication = communicationLookup.get(key) || communicationLookup.get(reverseKey);
    
    if (communication) {
      setSelectedPair(communication);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">From / To</th>
              {members.map(member => (
                <th key={member.user_id} className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  <div>
                    <div>{member.user_name}</div>
                    <div className="text-xs text-gray-500">{member.mbti.primary_type}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(fromMember => (
              <tr key={fromMember.user_id}>
                <td className="px-4 py-2 font-medium text-sm text-gray-700">
                  <div>
                    <div>{fromMember.user_name}</div>
                    <div className="text-xs text-gray-500">{fromMember.mbti.primary_type}</div>
                  </div>
                </td>
                {members.map(toMember => {
                  const key = `${fromMember.user_name}-${toMember.user_name}`;
                  const communication = communicationLookup.get(key);
                  const isSelf = fromMember.user_id === toMember.user_id;
                  
                  return (
                    <td
                      key={toMember.user_id}
                      className={`px-4 py-2 text-center ${
                        isSelf ? 'bg-gray-100' : 'cursor-pointer hover:bg-gray-50'
                      }`}
                      onClick={() => handleCellClick(fromMember, toMember)}
                    >
                      {isSelf ? (
                        <span className="text-gray-400">-</span>
                      ) : communication ? (
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getCompatibilityColor(communication.compatibility_score)
                        }`}>
                          {Math.round(communication.compatibility_score)}%
                        </div>
                      ) : (
                        <span className="text-gray-400">?</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Communication Tips Modal */}
      {selectedPair && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Communication Tips: {selectedPair.from_user} → {selectedPair.to_user}
            </h4>
            <button
              onClick={() => setSelectedPair(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {selectedPair.tips.map((tip: string, idx: number) => (
              <div key={idx} className="flex items-start">
                <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              Compatibility Score: {selectedPair.compatibility_score}% • 
              Types: {selectedPair.from_type} → {selectedPair.to_type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationMatrix;