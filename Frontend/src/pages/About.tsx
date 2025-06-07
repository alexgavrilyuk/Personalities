import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">About Our Assessment</h1>

        <div className="space-y-6">
          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              We believe in providing scientifically-grounded personality insights that help individuals 
              understand themselves better. Our comprehensive assessment combines multiple psychological 
              frameworks to give you a complete picture of your personality.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">The Science Behind It</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our assessment integrates three major personality frameworks:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <div>
                  <strong>Big Five Model:</strong> The gold standard in personality psychology, 
                  measuring Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <div>
                  <strong>MBTI Framework:</strong> Providing insights into your cognitive preferences 
                  and how you perceive and interact with the world.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <div>
                  <strong>Jungian Depth Psychology:</strong> Exploring deeper psychological patterns 
                  including archetypes and individuation processes.
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
            <p className="text-gray-300 leading-relaxed">
              We use advanced statistical methods including Item Response Theory (IRT) and factor 
              mixture modeling to ensure accurate and reliable results. Our 200-question assessment 
              is carefully designed to capture the nuances of your personality while respecting your time.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Privacy First</h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is our priority. We never share your personal data, and you have complete 
              control over your information. Create an account to save your progress and results, or 
              take the assessment anonymously – the choice is yours.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default About;