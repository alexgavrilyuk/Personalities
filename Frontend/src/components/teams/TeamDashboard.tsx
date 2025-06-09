import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import CreateTeamModal from './CreateTeamModal';
import TeamCard from './TeamCard';
import JoinTeamModal from './JoinTeamModal';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Team {
  id: string;
  name: string;
  description?: string;
  team_type: string;
  member_count: number;
  user_role: string;
  created_at: string;
  invite_code?: string;
}

const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await api.getUserTeams();
      setTeams(data.teams);
    } catch (err: any) {
      setError('Failed to load teams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      const newTeam = await api.createTeam(teamData);
      setTeams([...teams, newTeam.team]);
      setShowCreateModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (inviteCode: string) => {
    try {
      await api.joinTeam(inviteCode);
      await loadTeams(); // Reload teams
      setShowJoinModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to join team');
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await api.leaveTeam(teamId);
        setTeams(teams.filter(t => t.id !== teamId));
      } catch (err: any) {
        setError('Failed to leave team');
      }
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Sign in to use team features
        </h2>
        <p className="text-gray-600">
          Create teams and compare personalities with others
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Teams</h1>
        <p className="text-gray-600">
          Compare personalities with family, friends, or colleagues
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Team
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UsersIcon className="w-5 h-5 mr-2" />
          Join Team with Code
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No teams yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create a team to compare personalities with others, or join an existing team using an invite code
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onLeave={() => handleLeaveTeam(team.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTeam}
        />
      )}

      {showJoinModal && (
        <JoinTeamModal
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinTeam}
        />
      )}
    </div>
  );
};

export default TeamDashboard;