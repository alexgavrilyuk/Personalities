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
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Deep Dive' },
    { id: 'development', label: 'Growth Path' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Header */}
      <section className="bg-yellow-500 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-charcoal-700 uppercase tracking-wide mb-4">ASSESSMENT COMPLETE</p>
            <h1 className="font-serif text-5xl lg:text-7xl text-charcoal-800 mb-6">
              Your Personality <em>Revealed</em>
            </h1>
            <p className="text-xl text-charcoal-700 max-w-3xl mx-auto">
              Discover the unique blend of traits, preferences, and patterns that make you who you are
            </p>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="relative mt-16">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0V120Z" 
              fill="white"/>
          </svg>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-charcoal-200">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex justify-center py-4">
            <div className="inline-flex bg-charcoal-50 rounded-full p-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${
                    activeTab === tab.id
                      ? 'bg-charcoal-800 text-white'
                      : 'text-charcoal-600 hover:text-charcoal-800'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-16 py-16">
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
              className="bg-charcoal-50 rounded-3xl p-8 lg:p-12"
            >
              <h2 className="font-serif text-3xl text-charcoal-800 mb-6">Your Unique Profile</h2>
              <p className="text-lg text-charcoal-700 leading-relaxed whitespace-pre-wrap">
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
                className="bg-white rounded-3xl border border-charcoal-200 p-8 lg:p-10"
              >
                <h2 className="font-serif text-3xl text-charcoal-800 mb-8">Detailed Trait Analysis</h2>
                <div className="space-y-6">
                  {Object.entries(results.big_five.facet_scores).map(([dimension, facets]) => (
                    <div key={dimension}>
                      <h3 className="font-serif text-xl text-charcoal-800 mb-4">{dimension}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(facets).map(([facet, score]) => (
                          <div key={facet} className="flex items-center justify-between">
                            <span className="text-gray-600">{facet}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.5, delay: 0.1 }}
                                  className="h-full bg-yellow-500"
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
              className="bg-white rounded-3xl border border-charcoal-200 p-8 lg:p-10"
            >
              <h2 className="font-serif text-3xl text-charcoal-800 mb-8">Measurement Confidence</h2>
              <div className="space-y-4">
                {Object.entries(results.big_five.confidence_intervals).map(([dimension, interval]) => (
                  <div key={dimension}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{dimension}</span>
                      <span className="text-sm text-gray-500">
                        {interval.lower_bound.toFixed(1)} - {interval.upper_bound.toFixed(1)}
                      </span>
                    </div>
                    <div className="relative h-6 bg-charcoal-50 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-yellow-300 opacity-50"
                        style={{
                          left: `${interval.lower_bound}%`,
                          width: `${interval.upper_bound - interval.lower_bound}%`
                        }}
                      />
                      <div
                        className="absolute h-full w-1 bg-charcoal-800"
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
          className="mt-16 bg-charcoal-800 rounded-3xl p-8 lg:p-12 text-center"
        >
          <h3 className="font-serif text-2xl text-white mb-4">
            Save Your <em>Journey</em>
          </h3>
          <p className="text-charcoal-200 mb-8 max-w-2xl mx-auto">
            Your results are not stored automatically. Download them now to keep a record of your personality insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="btn-yellow inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const dataStr = JSON.stringify(results, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = 'personality-results.json';
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
              </svg>
              Export JSON
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;