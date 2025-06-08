import React from 'react';
import { motion } from 'framer-motion';

const Team: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-3">OUR TEAM</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-800 mb-8">
            Built by <em>Experts</em> in Psychology
          </h2>
          <p className="text-lg text-charcoal-600 max-w-3xl mx-auto">
            Our assessment was developed by a team of psychologists, data scientists, 
            and personality researchers with decades of combined experience.
          </p>
        </motion.div>

        {/* Simple Grid of Expertise Areas */}
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-serif text-charcoal-800">Ψ</span>
            </div>
            <h3 className="font-semibold text-charcoal-800 mb-2">Clinical Psychology</h3>
            <p className="text-charcoal-600 text-sm">Licensed psychologists specializing in personality assessment</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-serif text-charcoal-800">∑</span>
            </div>
            <h3 className="font-semibold text-charcoal-800 mb-2">Data Science</h3>
            <p className="text-charcoal-600 text-sm">Statistical experts using IRT and factor analysis</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-serif text-charcoal-800">◎</span>
            </div>
            <h3 className="font-semibold text-charcoal-800 mb-2">Research</h3>
            <p className="text-charcoal-600 text-sm">Published researchers in personality psychology</p>
          </motion.div>
        </div>

        {/* Simple decorative element */}
        <div className="flex justify-center mt-16">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 5 L32 25 L52 23 L35 30 L52 37 L32 35 L30 55 L28 35 L8 37 L25 30 L8 23 L28 25 Z" 
              stroke="#E5E5E5" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Team;