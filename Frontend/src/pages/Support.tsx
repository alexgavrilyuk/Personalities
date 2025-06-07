import React from 'react';
import { motion } from 'framer-motion';

const Support: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Support</h1>

        <div className="space-y-6">
          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  How long does the assessment take?
                </h3>
                <p className="text-gray-300">
                  The full assessment consists of 200 questions and typically takes 20-30 minutes to complete. 
                  You can save your progress and return later if you have an account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  Can I retake the assessment?
                </h3>
                <p className="text-gray-300">
                  Yes, you can take the assessment multiple times. Each assessment is saved separately 
                  so you can track changes in your personality over time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  How accurate are the results?
                </h3>
                <p className="text-gray-300">
                  Our assessment uses scientifically validated questions and advanced statistical methods. 
                  However, personality is complex and contextual. Results should be viewed as insights 
                  rather than absolute definitions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  Is my data safe?
                </h3>
                <p className="text-gray-300">
                  Absolutely. We use industry-standard encryption and never share your personal data. 
                  You can also take the assessment without creating an account if you prefer.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have a question that wasn't answered above? We're here to help!
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-purple-400">support@personalityassessment.com</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className="text-gray-300">We typically respond within 24-48 hours</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Technical Issues</h2>
            <p className="text-gray-300 mb-4">
              If you're experiencing technical difficulties:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Try refreshing the page
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Clear your browser cache and cookies
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Check your internet connection
              </li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;