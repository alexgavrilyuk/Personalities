import React from 'react';
import { motion } from 'framer-motion';

interface CTAProps {
  onStartTest: () => void;
}

const CTA: React.FC<CTAProps> = ({ onStartTest }) => {
  return (
    <section className="py-20 bg-charcoal-50">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl lg:text-6xl text-charcoal-800 mb-6"
          >
            Ready to <em>Discover</em> Your True Self?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-charcoal-600 mb-12"
          >
            Join thousands who have unlocked deep insights about their personality
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartTest}
              className="btn-yellow text-lg px-10 py-4"
            >
              Start Your Free Assessment
            </motion.button>
            
            {/* Decorative stars */}
            <div className="absolute -top-8 -right-8">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2 L21 18 L37 17 L22 20 L37 23 L21 22 L20 38 L19 22 L3 23 L18 20 L3 17 L19 18 Z" 
                  fill="#1A1A1A" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-6">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 1 L16 14 L29 13 L17 15 L29 17 L16 16 L15 29 L14 16 L1 17 L13 15 L1 13 L14 14 Z" 
                  stroke="#1A1A1A" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-12 text-charcoal-600"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-charcoal-800 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-charcoal-800 rounded-full"></div>
              <span>100% confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-charcoal-800 rounded-full"></div>
              <span>Science-backed methodology</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;