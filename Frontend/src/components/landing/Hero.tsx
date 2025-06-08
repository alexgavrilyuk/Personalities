import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStartTest: () => void;
  user: any;
  hasActiveAssessment: boolean;
}

const Hero: React.FC<HeroProps> = ({ onStartTest, user, hasActiveAssessment }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-dark-900 leading-tight mb-6">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-600">
                True Personality
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Unlock deep insights into your personality through our comprehensive assessment 
              that combines Big Five traits, MBTI preferences, and Jungian depth psychology.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartTest}
              className="bg-dark-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-dark-800 transition-colors duration-200 shadow-xl"
            >
              {user && hasActiveAssessment ? 'Continue Assessment' : 'Start Your Journey'}
            </motion.button>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-dark-900">10,000+</span> people have discovered their true selves
              </p>
            </div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[600px]">
              {/* Main Mind Illustration */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Brain/Mind Shape */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M200 80 C 120 80, 60 140, 60 200 C 60 280, 120 340, 200 340 C 280 340, 340 280, 340 200 C 340 140, 280 80, 200 80 Z"
                  fill="none"
                  stroke="#a8ff00"
                  strokeWidth="3"
                />
                
                {/* Inner Connections */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  {/* Neural Network Lines */}
                  <line x1="150" y1="150" x2="250" y2="250" stroke="#a8ff00" strokeWidth="2" opacity="0.5" />
                  <line x1="250" y1="150" x2="150" y2="250" stroke="#a8ff00" strokeWidth="2" opacity="0.5" />
                  <line x1="200" y1="120" x2="200" y2="280" stroke="#a8ff00" strokeWidth="2" opacity="0.5" />
                  <line x1="120" y1="200" x2="280" y2="200" stroke="#a8ff00" strokeWidth="2" opacity="0.5" />
                  
                  {/* Connection Nodes */}
                  <circle cx="150" cy="150" r="8" fill="#a8ff00" />
                  <circle cx="250" cy="150" r="8" fill="#a8ff00" />
                  <circle cx="150" cy="250" r="8" fill="#a8ff00" />
                  <circle cx="250" cy="250" r="8" fill="#a8ff00" />
                  <circle cx="200" cy="200" r="12" fill="#1c1f26" stroke="#a8ff00" strokeWidth="3" />
                </motion.g>

                {/* Personality Traits Orbiting */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="200" cy="50" r="20" fill="#1c1f26" stroke="#a8ff00" strokeWidth="2" />
                  <text x="200" y="55" textAnchor="middle" fill="#a8ff00" fontSize="12" fontWeight="bold">O</text>
                </motion.g>

                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="350" cy="200" r="20" fill="#1c1f26" stroke="#a8ff00" strokeWidth="2" />
                  <text x="350" y="205" textAnchor="middle" fill="#a8ff00" fontSize="12" fontWeight="bold">C</text>
                </motion.g>

                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="200" cy="350" r="20" fill="#1c1f26" stroke="#a8ff00" strokeWidth="2" />
                  <text x="200" y="355" textAnchor="middle" fill="#a8ff00" fontSize="12" fontWeight="bold">E</text>
                </motion.g>

                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="50" cy="200" r="20" fill="#1c1f26" stroke="#a8ff00" strokeWidth="2" />
                  <text x="50" y="205" textAnchor="middle" fill="#a8ff00" fontSize="12" fontWeight="bold">A</text>
                </motion.g>

                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="120" cy="120" r="20" fill="#1c1f26" stroke="#a8ff00" strokeWidth="2" />
                  <text x="120" y="125" textAnchor="middle" fill="#a8ff00" fontSize="12" fontWeight="bold">N</text>
                </motion.g>
              </svg>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 w-16 h-16 bg-lime-400 rounded-full opacity-20"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-20 left-10 w-12 h-12 bg-dark-900 rounded-lg opacity-20"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 right-20 w-8 h-8"
              >
                <div className="w-full h-full border-2 border-lime-400 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-900 mb-2">20-25 Minutes</h3>
            <p className="text-gray-600">Quick and comprehensive assessment</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-900 mb-2">100% Private</h3>
            <p className="text-gray-600">Your data is secure and confidential</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-900 mb-2">Science-Based</h3>
            <p className="text-gray-600">Validated psychological methods</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;