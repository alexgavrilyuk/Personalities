import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResultsDisplay from './ResultsDisplay';
import LoadingScreen from './LoadingScreen';
import { AssessmentResults } from '../types/assessment';

const ResultsWrapper: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session || !sessionId) {
      navigate('/');
      return;
    }

    fetchResults();
  }, [user, session, sessionId, navigate]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/responses/report/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/my-reports')}
            className="btn-primary"
          >
            Back to My Reports
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