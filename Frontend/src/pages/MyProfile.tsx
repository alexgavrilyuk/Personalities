import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Completion {
  assessmentType: string;
  completedAt: string;
  responseCount: number;
}

const MyProfile: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !session) {
      navigate('/login');
      return;
    }

    fetchCompletions();
  }, [user, session, navigate]);

  const fetchCompletions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/user/completions`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch completions');

      const data = await response.json();
      setCompletions(data.completions);
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (assessmentType: string = 'core') => {
    navigate(`/report/${assessmentType}`);
  };

  const startNewAssessment = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {/* User Info Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2 text-gray-300">
              <p>Email: {user?.email}</p>
              <p>Member since: {user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
            </div>
          </div>

          {/* Completed Assessments Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Completed Assessments</h2>
            
            {completions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  You haven't completed any assessments yet.
                </p>
                <button
                  onClick={startNewAssessment}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Core Assessment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completions.map((completion) => (
                  <div
                    key={completion.assessmentType}
                    className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4"
                  >
                    <div>
                      <h3 className="font-medium capitalize">
                        {completion.assessmentType} Assessment
                      </h3>
                      <p className="text-sm text-gray-400">
                        Completed: {formatDate(completion.completedAt)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Questions answered: {completion.responseCount}
                      </p>
                    </div>
                    <button
                      onClick={() => viewReport(completion.assessmentType)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future Assessments Preview */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 opacity-75">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Relationships Assessment - Understand your interpersonal dynamics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Career Assessment - Discover your professional strengths</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Leadership Assessment - Explore your leadership potential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;