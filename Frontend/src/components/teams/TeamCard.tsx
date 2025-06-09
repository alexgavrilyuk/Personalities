import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, CalendarIcon, ShareIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    description?: string;
    team_type: string;
    member_count: number;
    user_role: string;
    created_at: string;
    invite_code?: string;
  };
  onLeave: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onLeave }) => {
  const typeColors: Record<string, string> = {
    family: 'bg-blue-100 text-blue-800',
    friends: 'bg-green-100 text-green-800',
    work: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const typeIcons: Record<string, string> = {
    family: '👨‍👩‍👧‍👦',
    friends: '👥',
    work: '💼',
    other: '🌟'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const copyInviteCode = () => {
    if (team.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      // Could add a toast notification here
      alert(`Invite code copied: ${team.invite_code}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{typeIcons[team.team_type] || '🌟'}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[team.team_type] || typeColors.other}`}>
                {team.team_type}
              </span>
            </div>
          </div>
          {team.user_role === 'owner' && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Owner
            </span>
          )}
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-1" />
            <span>{team.member_count} member{team.member_count !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{formatDate(team.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {team.user_role === 'owner' && team.invite_code && (
              <button
                onClick={copyInviteCode}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                title="Copy invite code"
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                Invite
              </button>
            )}
            <button
              onClick={onLeave}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Leave
            </button>
          </div>
          <Link
            to={`/teams/${team.id}`}
            className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            View Insights
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;