import React from 'react';
import { motion } from 'framer-motion';

interface TestInstructionsProps {
  onBegin: () => void;
}

const TestInstructions: React.FC<TestInstructionsProps> = ({ onBegin }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Before We Begin
          </h2>
          
          <div className="space-y-6 text-gray-600">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Be Honest</h3>
                <p>There are no right or wrong answers. Answer based on how you truly are, not how you wish to be.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Trust Your First Instinct</h3>
                <p>Don't overthink your responses. Your initial reaction is usually the most accurate.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Find a Quiet Space</h3>
                <p>Complete the assessment in a comfortable environment where you won't be interrupted.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Complete in One Session</h3>
                <p>For the most accurate results, try to complete all questions in a single sitting.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Notice:</strong> Your responses are processed in real-time and are not stored. 
              The results are only visible to you and will be lost if you refresh the page.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBegin}
            className="w-full mt-8 btn-primary text-lg"
          >
            I'm Ready to Begin
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestInstructions;