import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { SparklesIcon, ArrowRightIcon, ExclamationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import SignupModal from '../auth/SignupModal';
import { useAuth } from '../../contexts/AuthContext';

const DiscoveryResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;
  const { user } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);

  if (!results) {
    navigate('/');
    return null;
  }

  const { profile, report } = results;

  // Prepare data for radar chart
  const radarData = report.sections[0].visual_data.labels.map((label: string, idx: number) => ({
    trait: label,
    score: report.sections[0].visual_data.values[idx],
    percentile: report.sections[0].visual_data.percentiles[idx]
  }));

  const handleTakeFullAssessment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowSignupModal(true);
    } else {
      navigate('/');
    }
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Discovery Results</h1>
            <button
              onClick={handleTakeFullAssessment}
              className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              {!user && <LockClosedIcon className="w-4 h-4 mr-1" />}
              Take Full Assessment
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Confidence Warning */}
        {profile.big_five.confidence_warning && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
            <ExclamationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">{profile.big_five.confidence_warning}</p>
              {profile.big_five.high_uncertainty_traits.length > 0 && (
                <p className="text-amber-700 text-sm mt-1">
                  Particularly uncertain: {profile.big_five.high_uncertainty_traits.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personality Snapshot */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                {report.sections[0].title}
              </h2>
            </div>
            <p className="text-gray-700 mb-6">{report.sections[0].content}</p>
            
            {/* Radar Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="trait" className="text-sm" />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Radar
                  name="Your Scores"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Tentative Type */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {report.sections[1].title}
            </h2>
            <div className="mb-4">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {profile.mbti.primary_type}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="bg-gray-200 rounded-full h-2 w-32 mr-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${report.sections[1].confidence_percentage}%` }}
                  />
                </div>
                <span>{report.sections[1].confidence_percentage}% confidence</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{report.sections[1].content}</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">{report.sections[1].confidence_note}</p>
            </div>
          </div>
        </div>

        {/* Strengths and Growth */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {report.sections[2].title}
            </h2>
            <div className="space-y-4">
              {report.sections[2].content.map((strength: any, idx: number) => (
                <div key={idx} className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-1">{strength.title}</h3>
                  <p className="text-gray-700 text-sm">{strength.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Edge */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {report.sections[3].title}
            </h2>
            <div className="space-y-4">
              {report.sections[3].content.map((growth: any, idx: number) => (
                <div key={idx} className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">{growth.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{growth.description}</p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Try this:</p>
                    <p className="text-sm text-gray-600">{growth.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">{report.sections[4].title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line">{report.sections[4].content}</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTakeFullAssessment}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {!user && <LockClosedIcon className="w-5 h-5 mr-2" />}
              Take Full Assessment
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            <Link
              to="/premium"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors"
            >
              Unlock Premium Assessments
            </Link>
          </div>
        </div>
      </div>
      
      {/* Signup Modal - no skip option */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
        hideSkip={true}
        context="discovery"
      />
    </div>
  );
};

export default DiscoveryResults;