import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparklesIcon, UsersIcon } from '@heroicons/react/24/outline';

interface HeroProps {
  onStartTest: () => void;
  user: any;
  hasActiveAssessment: boolean;
}

const Hero: React.FC<HeroProps> = ({ onStartTest, user, hasActiveAssessment }) => {
  return (
    <section className="relative bg-yellow-500 min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="font-serif text-5xl lg:text-7xl text-charcoal-800 leading-tight mb-8">
              <span className="italic">Discover Your</span>
              <br />
              <span className="font-bold">True Self</span>
            </h1>
            <p className="text-charcoal-700 text-lg lg:text-xl mb-8 max-w-lg leading-relaxed">
              Start with our 60-question Discovery Assessment in just 10 minutes, or dive deep with 
              our comprehensive 200-question analysis. Unlock premium features for relationship insights, 
              career alignment, and team comparisons.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/discovery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Start Discovery (60 questions)
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartTest}
                className="btn-secondary"
              >
                {user && hasActiveAssessment ? 'Continue Full Assessment' : 'Full Assessment (200 questions)'}
              </motion.button>
            </div>
            
            {user && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/teams" className="inline-flex items-center text-charcoal-700 hover:text-charcoal-900">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">My Teams</span>
                </Link>
                <Link to="/premium" className="inline-flex items-center text-charcoal-700 hover:text-charcoal-900">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">Unlock Premium</span>
                </Link>
              </div>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 text-charcoal-700">
              <div>
                <div className="text-3xl font-bold text-charcoal-800">82%</div>
                <div className="text-sm">users report deep self-insights</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-charcoal-800">93%</div>
                <div className="text-sm">accuracy through validation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-charcoal-800">6</div>
                <div className="text-sm">assessment layers for depth</div>
              </div>
            </div>
          </motion.div>

          {/* Right Illustration Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full">
              {/* Main Image Container - would be replaced with actual photo */}
              <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                  {/* Line Art Illustration */}
                  <svg viewBox="0 0 300 400" className="w-3/4 h-3/4" xmlns="http://www.w3.org/2000/svg">
                    {/* Person silhouette */}
                    <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                      {/* Head */}
                      <circle cx="150" cy="80" r="40" />
                      
                      {/* Body */}
                      <path d="M150 120 L150 250" />
                      <path d="M150 140 L100 180 M150 140 L200 180" />
                      <path d="M150 250 L120 320 M150 250 L180 320" />
                      
                      {/* Mind/Brain representation */}
                      <path d="M130 60 Q150 50 170 60 Q180 80 170 100 Q150 110 130 100 Q120 80 130 60" />
                      
                      {/* Personality elements floating around */}
                      <circle cx="80" cy="60" r="15" />
                      <circle cx="220" cy="60" r="15" />
                      <circle cx="60" cy="150" r="15" />
                      <circle cx="240" cy="150" r="15" />
                      <circle cx="90" cy="240" r="15" />
                      <circle cx="210" cy="240" r="15" />
                      
                      {/* Connecting lines */}
                      <path d="M95 70 L130 80" strokeDasharray="2,2" opacity="0.5" />
                      <path d="M205 70 L170 80" strokeDasharray="2,2" opacity="0.5" />
                      <path d="M75 150 L100 170" strokeDasharray="2,2" opacity="0.5" />
                      <path d="M225 150 L200 170" strokeDasharray="2,2" opacity="0.5" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 0 L65 45 L110 40 L70 60 L110 80 L65 75 L60 120 L55 75 L10 80 L50 60 L10 40 L55 45 Z" 
                    fill="#1A1A1A" />
                </svg>
              </div>

              <div className="absolute -bottom-6 -left-6">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 5 L42 35 L72 33 L45 40 L72 47 L42 45 L40 75 L38 45 L8 47 L35 40 L8 33 L38 35 Z" 
                    stroke="#1A1A1A" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Small decorative dots */}
              <div className="absolute top-1/2 -right-12 w-3 h-3 bg-charcoal-800 rounded-full"></div>
              <div className="absolute -top-4 left-1/2 w-2 h-2 bg-charcoal-800 rounded-full"></div>
              <div className="absolute bottom-1/3 -left-8 w-4 h-4 bg-charcoal-800 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
            fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;