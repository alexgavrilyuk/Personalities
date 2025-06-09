import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_API_BASE_URL } from '../utils/api';
import ResultsDisplay from './ResultsDisplay';
import LoadingScreen from './LoadingScreen';
import { AssessmentResults } from '../types/assessment';

const ResultsWrapper: React.FC = () => {
  const { assessmentType } = useParams<{ assessmentType?: string }>();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNoAssessments, setHasNoAssessments] = useState(false);

  useEffect(() => {
    if (!user || !session) {
      navigate('/login');
      return;
    }

    fetchResults();
  }, [user, session, assessmentType, navigate]);

  const fetchResults = async () => {
    try {
      const type = assessmentType || 'core';
      const response = await fetch(`${AUTH_API_BASE_URL}/user/report/${type}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setHasNoAssessments(true);
          return;
        }
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setResults(data.report);
    } catch (err) {
      setError('Failed to load your results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (hasNoAssessments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to Your Profile</h1>
            <p className="text-xl text-gray-300 mb-8">
              You haven't completed any assessments yet. Start your journey of self-discovery today!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Start Core Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Results</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return <ResultsDisplay results={results} />;
};

export default ResultsWrapper;