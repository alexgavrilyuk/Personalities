import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Assessment {
  id: string;
  startedAt: string;
  completedAt: string | null;
  totalResponses: number;
  isComplete: boolean;
}

const MyReports: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !session) {
      navigate('/');
      return;
    }

    fetchAssessments();
  }, [user, session, navigate]);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/user/assessments`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch assessments');

      const data = await response.json();
      setAssessments(data.assessments);
    } catch (err) {
      setError('Failed to load assessments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (sessionId: string) => {
    // Navigate to results page with session ID
    navigate(`/results/${sessionId}`);
  };

  const continueAssessment = () => {
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
        <h1 className="text-3xl font-bold mb-8">My Reports</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 text-center">
            <h2 className="text-xl font-semibold mb-4">No Assessments Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't completed any personality assessments yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Your First Assessment
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {assessment.isComplete ? 'Completed Assessment' : 'In Progress'}
                    </h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Started: {formatDate(assessment.startedAt)}</p>
                      {assessment.completedAt && (
                        <p>Completed: {formatDate(assessment.completedAt)}</p>
                      )}
                      <p>Responses: {assessment.totalResponses} / 200</p>
                    </div>
                    {!assessment.isComplete && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(assessment.totalResponses / 200) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((assessment.totalResponses / 200) * 100)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {assessment.isComplete ? (
                      <button
                        onClick={() => viewReport(assessment.id)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Report
                      </button>
                    ) : (
                      <button
                        onClick={continueAssessment}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyReports;