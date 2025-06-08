import React from 'react';
import { motion } from 'framer-motion';

interface CTAProps {
  onStartTest: () => void;
}

const CTA: React.FC<CTAProps> = ({ onStartTest }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-dark-900 mb-6"
          >
            Let's unlock your potential
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-12"
          >
            Join thousands who have discovered their true personality and transformed their understanding of themselves.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block"
          >
            {/* Animated Background Elements */}
            <div className="absolute -inset-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-32 h-32"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 10 L90 50 L50 90 L10 50 Z"
                    fill="none"
                    stroke="#a8ff00"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                </svg>
              </motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-40 h-40"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1c1f26"
                    strokeWidth="2"
                    opacity="0.1"
                    strokeDasharray="10 5"
                  />
                </svg>
              </motion.div>

              {/* Floating dots */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 w-3 h-3 bg-lime-400 rounded-full opacity-60"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 left-10 w-4 h-4 bg-dark-900 rounded-full opacity-20"
              />
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartTest}
              className="relative bg-dark-900 text-white px-12 py-6 rounded-full text-xl font-semibold hover:bg-dark-800 transition-colors duration-200 shadow-2xl"
            >
              Start Your Free Assessment
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-12 text-gray-600"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Science-backed methodology</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;