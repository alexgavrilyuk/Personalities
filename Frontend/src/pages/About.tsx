import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const frameworks = [
    {
      title: 'Big Five Model',
      description: 'The gold standard in personality psychology, measuring Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
      icon: (
        <svg viewBox="0 0 60 60" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="30" cy="30" r="20" />
            <path d="M30 20 L35 25 L35 35 L25 35 L25 25 Z" />
            <circle cx="30" cy="30" r="3" fill="currentColor" />
          </g>
        </svg>
      )
    },
    {
      title: 'MBTI Framework',
      description: 'Providing insights into your cognitive preferences and how you perceive and interact with the world.',
      icon: (
        <svg viewBox="0 0 60 60" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="2" fill="none">
            <rect x="15" y="15" width="30" height="30" rx="5" />
            <line x1="30" y1="15" x2="30" y2="45" />
            <line x1="15" y1="30" x2="45" y2="30" />
          </g>
        </svg>
      )
    },
    {
      title: 'Jungian Depth Psychology',
      description: 'Exploring deeper psychological patterns including archetypes and individuation processes.',
      icon: (
        <svg viewBox="0 0 60 60" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="30" cy="20" r="8" />
            <circle cx="20" cy="40" r="8" />
            <circle cx="40" cy="40" r="8" />
            <path d="M26 26 L24 34 M34 26 L36 34 M26 40 L34 40" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="bg-yellow-500 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-sm text-charcoal-700 uppercase tracking-wide mb-4">ABOUT US</p>
            <h1 className="font-serif text-5xl lg:text-7xl text-charcoal-800 mb-6">
              The Science of <em>Self-Discovery</em>
            </h1>
            <p className="text-xl text-charcoal-700 leading-relaxed max-w-3xl">
              We combine cutting-edge psychological research with thoughtful design to create 
              the most comprehensive personality assessment available.
            </p>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="relative">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0V120Z" 
              fill="white"/>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-charcoal-600 leading-relaxed mb-6">
                We believe in providing scientifically-grounded personality insights that help individuals 
                understand themselves better. Our comprehensive assessment combines multiple psychological 
                frameworks to give you a complete picture of your personality.
              </p>
              <p className="text-lg text-charcoal-600 leading-relaxed">
                Every question, every algorithm, and every insight is designed with one goal: 
                to help you gain genuine self-understanding that leads to personal growth.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-charcoal-50 rounded-3xl p-12 relative">
                {/* Decorative illustration */}
                <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                    {/* Central figure */}
                    <circle cx="150" cy="150" r="60" />
                    <circle cx="150" cy="150" r="40" />
                    <circle cx="150" cy="150" r="20" />
                    
                    {/* Radiating elements */}
                    <path d="M150 70 L150 50 M150 230 L150 250" />
                    <path d="M230 150 L250 150 M70 150 L50 150" />
                    <path d="M206 94 L220 80 M94 206 L80 220" />
                    <path d="M206 206 L220 220 M94 94 L80 80" />
                    
                    {/* Corner decorations */}
                    <circle cx="50" cy="50" r="10" fill="#F5D659" />
                    <circle cx="250" cy="50" r="10" fill="#F5D659" />
                    <circle cx="50" cy="250" r="10" fill="#F5D659" />
                    <circle cx="250" cy="250" r="10" fill="#F5D659" />
                  </g>
                </svg>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-charcoal-800 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-20 bg-charcoal-50">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-4">THE SCIENCE</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-800">
              Three Frameworks, <em>One Complete Picture</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {frameworks.map((framework, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center"
              >
                <div className="text-yellow-500 mb-6 flex justify-center">
                  {framework.icon}
                </div>
                <h3 className="font-serif text-2xl text-charcoal-800 mb-4">{framework.title}</h3>
                <p className="text-charcoal-600 leading-relaxed">{framework.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal-800 mb-6">
                Statistical Rigor Meets <em>Human Understanding</em>
              </h2>
              <p className="text-lg text-charcoal-600 leading-relaxed mb-6">
                We use advanced statistical methods including Item Response Theory (IRT) and factor 
                mixture modeling to ensure accurate and reliable results.
              </p>
              <p className="text-lg text-charcoal-600 leading-relaxed mb-8">
                Our 200-question assessment is carefully designed to capture the nuances of your 
                personality while respecting your time. Each question is calibrated to provide 
                maximum insight with minimum effort.
              </p>
              <Link to="/" className="btn-primary inline-block">
                Start Your Assessment
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-yellow-500 rounded-3xl p-8 lg:p-12"
            >
              <h3 className="font-serif text-2xl text-charcoal-800 mb-6 italic">
                By the Numbers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="font-serif text-5xl text-charcoal-800 italic">200</div>
                  <div>
                    <div className="font-semibold text-charcoal-800">Carefully Crafted Questions</div>
                    <div className="text-charcoal-700">Each validated through rigorous testing</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="font-serif text-5xl text-charcoal-800 italic">3</div>
                  <div>
                    <div className="font-semibold text-charcoal-800">Integrated Frameworks</div>
                    <div className="text-charcoal-700">Big Five, MBTI, and Jungian psychology</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="font-serif text-5xl text-charcoal-800 italic">1M+</div>
                  <div>
                    <div className="font-semibold text-charcoal-800">Statistical Calculations</div>
                    <div className="text-charcoal-700">Ensuring precise, reliable results</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-charcoal-800 text-white">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-4xl lg:text-5xl mb-6">
              Your Privacy, <em>Our Promise</em>
            </h2>
            <p className="text-xl text-charcoal-200 leading-relaxed mb-8">
              We never share your personal data, and you have complete control over your information. 
              Create an account to save your progress and results, or take the assessment anonymously — 
              the choice is yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-yellow inline-block">
                Take Assessment Anonymously
              </Link>
              <Link to="/login" className="btn-secondary inline-block">
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;