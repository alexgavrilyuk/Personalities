import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BigFiveChart from './BigFiveChart';
import MBTITypeCard from './MBTITypeCard';
import CognitiveFunctions from './CognitiveFunctions';
import TraitInteractions from './TraitInteractions';
import UniquenessAnalysis from './UniquenessAnalysis';
import { DocumentTextIcon, UsersIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface EnhancedResultsProps {
  results: any;
  isPremium?: boolean;
}

const EnhancedResults: React.FC<EnhancedResultsProps> = ({ results, isPremium = false }) => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'traits', label: 'Big Five Deep Dive' },
    { id: 'type', label: 'Personality Type' },
    { id: 'uniqueness', label: 'What Makes You Unique' },
    { id: 'interactions', label: 'Trait Interactions' },
    { id: 'growth', label: 'Growth Blueprint' }
  ];

  const premiumFeatures = [
    {
      title: 'Relationship Dynamics',
      description: 'Understand your attachment style and love languages',
      icon: '❤️',
      link: '/assessment/relationships'
    },
    {
      title: 'Career Alignment',
      description: 'Discover careers that match your personality',
      icon: '💼',
      link: '/assessment/career'
    },
    {
      title: 'Team Insights',
      description: 'Compare personalities with others',
      icon: '👥',
      link: '/teams'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Personality Profile</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Export Report
              </button>
              <Link
                to="/teams"
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <UsersIcon className="w-5 h-5 mr-2" />
                Compare with Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${activeSection === section.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                {results.report.sections[0].content}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Big Five Profile</h3>
                <BigFiveChart data={results.profile.big_five} compact />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <MBTITypeCard mbti={results.profile.mbti} compact />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Uniqueness Score</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {results.profile.uniqueness?.uniqueness_score || 50}/100
                </div>
                <p className="text-sm text-gray-600">
                  Your personality combination is statistically {
                    (results.profile.uniqueness?.uniqueness_score || 50) > 70 ? 'rare' : 'balanced'
                  }
                </p>
              </div>
            </div>

            {/* Premium Features Upsell */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Unlock Deeper Insights</h3>
                  <LockClosedIcon className="w-6 h-6" />
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {premiumFeatures.map((feature, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/premium"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Unlock Premium Features - $24.99
                </Link>
              </div>
            )}
          </div>
        )}

        {activeSection === 'traits' && (
          <div className="space-y-6">
            {['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'].map((trait, idx) => {
              const traitSection = results.report.sections.find((s: any) => s.trait === trait);
              if (!traitSection) return null;

              return (
                <div key={trait} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{traitSection.title}</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Score</span>
                          <span className="text-sm font-bold text-purple-600">
                            {traitSection.score_summary.score}/100
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full"
                            style={{ width: `${traitSection.score_summary.score}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {traitSection.score_summary.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{traitSection.narrative}</p>
                  </div>

                  {traitSection.implications && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-900 mb-3">Real-World Implications</h3>
                      <div className="space-y-2">
                        {traitSection.implications.map((imp: any, impIdx: number) => (
                          <div key={impIdx} className="bg-gray-50 rounded-lg p-3">
                            <div className="font-medium text-gray-700">{imp.domain}</div>
                            <div className="text-sm text-gray-600">{imp.implication}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeSection === 'type' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <MBTITypeCard mbti={results.profile.mbti} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <CognitiveFunctions functions={results.profile.cognitive_functions} />
            </div>
          </div>
        )}

        {activeSection === 'uniqueness' && (
          <UniquenessAnalysis uniqueness={results.profile.uniqueness} />
        )}

        {activeSection === 'interactions' && (
          <TraitInteractions 
            interactions={results.profile.trait_interactions}
            bigFiveScores={results.profile.big_five.scores}
          />
        )}

        {activeSection === 'growth' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Personalized Growth Blueprint
            </h2>
            {results.report.sections.find((s: any) => s.type === 'growth_plan')?.growth_areas.map((area: any, idx: number) => (
              <div key={idx} className="mb-6 pb-6 border-b last:border-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.area}</h3>
                <p className="text-gray-700 mb-3">{area.description}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Action Steps:</p>
                  <ul className="space-y-1">
                    {area.actions.map((action: string, actIdx: number) => (
                      <li key={actIdx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedResults;