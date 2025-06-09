import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import QuestionDisplay from '../QuestionDisplay';
import ProgressBar from '../ProgressBar';
import { ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Question {
  id: string;
  text: string;
  response_type: 'likert_7' | 'likert_5' | 'forced_choice';
  dimension?: string;
  reverse_scored: boolean;
  assessment_layer: 'primary' | 'secondary' | 'tertiary';
}

const DiscoveryAssessment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    loadDiscoveryQuestions();
  }, []);

  const loadDiscoveryQuestions = async () => {
    try {
      const data = await api.startPremiumAssessment('discovery');
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load discovery questions:', error);
      setLoading(false);
    }
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
    
    // Auto-advance to next question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Format responses for API
      const formattedResponses = Object.entries(responses).map(([questionId, value]) => ({
        question_id: questionId,
        response_value: value.response_value || null,
        selected_option: value.selected_option || null
      }));

      const result = await api.submitPremiumAssessment('discovery', {
        responses: formattedResponses
      });

      // Navigate to results with data
      navigate('/discovery-results', { state: { results: result } });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      setSubmitting(false);
    }
  };

  const canSubmit = Object.keys(responses).length === questions.length;
  const progress = questions.length > 0 ? (Object.keys(responses).length / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading discovery assessment...</p>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 md:p-12">
          <div className="text-center">
            <SparklesIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discovery Assessment
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get a quick snapshot of your personality in just 10 minutes
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">What to expect:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                60 carefully selected questions
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Preliminary Big Five trait scores
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Initial personality type indication
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Personalized insights and growth areas
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center text-gray-600 mb-8">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span>Estimated time: 8-10 minutes</span>
          </div>

          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Start Discovery Assessment
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Want more depth? Try our full 200-question assessment after this
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Discovery Assessment</h1>
            <span className="text-sm text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <ProgressBar 
            current={Object.keys(responses).length}
            total={questions.length}
            className="mt-2"
          />
        </div>
      </div>

      {/* Question Display */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={(response) => {
                setResponses({
                  ...responses,
                  [response.question_id]: response
                });
                
                // Auto-advance to next question
                if (currentIndex < questions.length - 1) {
                  setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                  }, 300);
                }
              }}
              currentAnswer={responses[currentQuestion.id]}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors
                ${currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={`px-8 py-2 rounded-lg font-medium transition-all
                  ${canSubmit && !submitting
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {submitting ? 'Processing...' : 'Get My Results'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!responses[currentQuestion?.id]}
                className={`px-6 py-2 rounded-lg font-medium transition-colors
                  ${responses[currentQuestion?.id]
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {Object.keys(responses).length} answered • 
            {questions.length - Object.keys(responses).length} remaining • 
            ~{Math.ceil((questions.length - Object.keys(responses).length) * 0.15)} minutes left
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryAssessment;