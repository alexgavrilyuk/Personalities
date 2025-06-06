import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BigFiveChart from './results/BigFiveChart';
import MBTITypeCard from './results/MBTITypeCard';
import CognitiveFunctions from './results/CognitiveFunctions';
import PersonalityClusterCard from './results/PersonalityClusterCard';
import JungianInsights from './results/JungianInsights';
import DevelopmentSuggestions from './results/DevelopmentSuggestions';
import { AssessmentResults } from '../types/assessment';

interface ResultsDisplayProps {
  results: AssessmentResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'development'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🎯' },
    { id: 'details', label: 'Deep Dive', icon: '🔍' },
    { id: 'development', label: 'Growth Path', icon: '🌱' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            Your Personality Profile
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* MBTI Type Card - Hero Section */}
            <MBTITypeCard mbti={results.mbti} />

            {/* Interpretation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Unique Profile</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {results.interpretation}
              </p>
            </motion.div>

            {/* Big Five Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BigFiveChart bigFive={results.big_five} />
            </motion.div>

            {/* Quick Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <PersonalityClusterCard cluster={results.personality_cluster} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <JungianInsights depth={results.jungian_depth} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Cognitive Functions */}
            <CognitiveFunctions functions={results.cognitive_functions} />

            {/* Facet Scores */}
            {results.big_five.facet_scores && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Trait Analysis</h2>
                <div className="space-y-6">
                  {Object.entries(results.big_five.facet_scores).map(([dimension, facets]) => (
                    <div key={dimension}>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">{dimension}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(facets).map(([facet, score]) => (
                          <div key={facet} className="flex items-center justify-between">
                            <span className="text-gray-600">{facet}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.5, delay: 0.1 }}
                                  className="h-full bg-primary-500"
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                                {Math.round(score)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Confidence Intervals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Measurement Confidence</h2>
              <div className="space-y-4">
                {Object.entries(results.big_five.confidence_intervals).map(([dimension, interval]) => (
                  <div key={dimension}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{dimension}</span>
                      <span className="text-sm text-gray-500">
                        {interval.lower_bound.toFixed(1)} - {interval.upper_bound.toFixed(1)}
                      </span>
                    </div>
                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary-200 opacity-50"
                        style={{
                          left: `${interval.lower_bound}%`,
                          width: `${interval.upper_bound - interval.lower_bound}%`
                        }}
                      />
                      <div
                        className="absolute h-full w-1 bg-primary-600"
                        style={{ left: `${interval.point_estimate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DevelopmentSuggestions suggestions={results.development_suggestions} />
          </motion.div>
        )}

        {/* Download/Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 mb-4">
            Remember to save your results - they won't be stored and will be lost if you refresh the page.
          </p>
          <button
            onClick={() => window.print()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Save Results as PDF
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;