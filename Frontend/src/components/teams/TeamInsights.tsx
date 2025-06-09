import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import TeamRadarChart from './TeamRadarChart';
import CommunicationMatrix from './CommunicationMatrix';
import TeamStrengths from './TeamStrengths';
import { ArrowLeftIcon, UsersIcon, LightBulbIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TeamInsights {
  team_composition: any;
  communication_map: any[];
  potential_conflicts: any[];
  team_strengths: any[];
  blind_spots: any[];
  collaboration_suggestions: any[];
  team_dynamics: any;
  leadership_analysis: any;
}

const TeamInsights: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<TeamInsights | null>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && teamId) {
      loadTeamInsights();
    }
  }, [user, teamId]);

  const loadTeamInsights = async () => {
    try {
      setLoading(true);
      // Load team details and insights
      const [teamData, insightsData] = await Promise.all([
        api.getTeamDetails(teamId!),
        api.getTeamInsights(teamId!)
      ]);
      
      setTeamInfo(teamData);
      setInsights(insightsData.insights);
    } catch (err: any) {
      setError('Failed to load team insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view team insights</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing team dynamics...</p>
      </div>
    );
  }

  if (error || !insights || !teamInfo) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-700">{error || 'Unable to load team insights'}</p>
        <button
          onClick={() => navigate('/teams')}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          Back to teams
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UsersIcon },
    { id: 'communication', label: 'Communication', icon: null },
    { id: 'strengths', label: 'Strengths & Gaps', icon: LightBulbIcon },
    { id: 'dynamics', label: 'Team Dynamics', icon: null }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/teams')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to teams
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{teamInfo.team.name}</h1>
            <p className="text-gray-600 mt-1">
              {teamInfo.member_count} members • {insights.team_composition.team_profile}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {teamInfo.team.team_type}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon && <tab.icon className="w-5 h-5 inline mr-2" />}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Team Composition */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personality Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <TeamRadarChart 
                    data={insights.team_composition.trait_averages}
                    title="Team Average Traits"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Team Profile</h3>
                    <p className="text-gray-600">{insights.team_composition.team_profile}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Balance Score</h3>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${insights.team_composition.balance_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {insights.team_composition.balance_score}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Diversity Score</h3>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${insights.team_composition.diversity_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {insights.team_composition.diversity_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Top Team Strengths</h3>
                <ul className="space-y-2">
                  {insights.team_strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <div>
                        <div className="font-medium text-gray-900">{strength.strength}</div>
                        <div className="text-sm text-gray-600">{strength.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Key Watch Areas</h3>
                <ul className="space-y-2">
                  {insights.blind_spots.slice(0, 3).map((spot, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-amber-600 mr-2">!</span>
                      <div>
                        <div className="font-medium text-gray-900">{spot.blind_spot}</div>
                        <div className="text-sm text-gray-600">{spot.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === 'communication' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Communication Guide</h2>
            <CommunicationMatrix 
              members={teamInfo.members}
              communicationMap={insights.communication_map}
            />
            
            {/* Potential Conflicts */}
            {insights.potential_conflicts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Potential Friction Points</h3>
                <div className="space-y-4">
                  {insights.potential_conflicts.slice(0, 3).map((conflict, idx) => (
                    <div key={idx} className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {conflict.members.join(' ↔ ')}
                          </h4>
                          <ul className="mt-2 space-y-1">
                            {conflict.areas.map((area: any, aIdx: number) => (
                              <li key={aIdx} className="text-sm text-gray-600">
                                • {area.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm font-medium text-yellow-800">
                          {conflict.severity}% severity
                        </div>
                      </div>
                      {conflict.mitigation && (
                        <div className="mt-3 pt-3 border-t border-yellow-200">
                          <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                          <ul className="mt-1 text-sm text-gray-600">
                            {conflict.mitigation.map((tip: string, tIdx: number) => (
                              <li key={tIdx}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'strengths' && (
          <TeamStrengths 
            strengths={insights.team_strengths}
            blindSpots={insights.blind_spots}
            suggestions={insights.collaboration_suggestions}
          />
        )}

        {activeTab === 'dynamics' && (
          <div className="space-y-6">
            {/* Work Pace */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Pace & Style</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Pace: </span>
                  <span className="text-gray-900">{insights.team_dynamics.work_pace.pace}</span>
                </div>
                <p className="text-gray-600">{insights.team_dynamics.work_pace.description}</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">Optimal approach:</p>
                  <p className="text-gray-600">{insights.team_dynamics.work_pace.optimal_project_length}</p>
                </div>
              </div>
            </div>

            {/* Innovation Potential */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Innovation Potential</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{insights.team_dynamics.innovation_potential.potential}</span>
                  <span className="text-sm font-medium text-gray-500">
                    Score: {insights.team_dynamics.innovation_potential.score}/100
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    style={{ width: `${insights.team_dynamics.innovation_potential.score}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600">{insights.team_dynamics.innovation_potential.description}</p>
            </div>

            {/* Leadership Analysis */}
            {insights.leadership_analysis.natural_leaders.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leadership Dynamics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Natural Leaders</p>
                    <div className="space-y-2">
                      {insights.leadership_analysis.natural_leaders.slice(0, 3).map((leader: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                          <div>
                            <span className="font-medium">{leader.member}</span>
                            <span className="text-sm text-gray-600 ml-2">({leader.type})</span>
                          </div>
                          <span className="text-sm font-medium text-purple-600">
                            {leader.style} style
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Recommended approach: </span>
                      {insights.leadership_analysis.distributed_leadership.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamInsights;