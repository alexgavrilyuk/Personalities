import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const assessmentTiers = [
    {
      tier: 'Discovery',
      questions: '60',
      time: '10 minutes',
      price: 'Free',
      color: 'bg-green-100 border-green-300',
      features: [
        'Quick personality snapshot',
        'Big Five trait overview',
        'Initial MBTI indication',
        'Basic insights'
      ],
      link: '/discovery',
      buttonText: 'Start Discovery'
    },
    {
      tier: 'Core',
      questions: '200',
      time: '25-35 minutes',
      price: 'Free',
      color: 'bg-blue-100 border-blue-300',
      features: [
        'Comprehensive Big Five analysis',
        'Confident MBTI typing',
        'Cognitive function stack',
        'Jungian depth insights',
        'Detailed interpretation'
      ],
      link: '/',
      buttonText: 'Take Full Assessment',
      isMainTest: true
    },
    {
      tier: 'Premium',
      questions: '7 Assessments',
      time: 'Unlimited',
      price: '$24.99',
      color: 'bg-purple-100 border-purple-300',
      features: [
        'Relationship dynamics',
        'Career alignment',
        'Emotional intelligence',
        'Leadership potential',
        'Creative expression',
        'Team comparisons',
        'Lifetime updates'
      ],
      link: '/premium',
      buttonText: 'Unlock Premium'
    }
  ];

  const features = [
    'Private and secure assessment',
    'Scientifically validated methods',
    'Team comparison features',
    'Premium assessments available',
    'Integration of multiple frameworks',
    'Professional-grade insights'
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-3">CHOOSE YOUR JOURNEY</p>
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-800 mb-4">
            Three Ways to <em>Discover Yourself</em>
          </h2>
        </motion.div>

        {/* Assessment Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {assessmentTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${tier.color} border-2 rounded-2xl p-8 relative transform hover:scale-105 transition-transform`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-charcoal-800 mb-2">{tier.tier}</h3>
                <div className="text-3xl font-bold text-charcoal-900">{tier.price}</div>
                <div className="text-sm text-charcoal-600 mt-1">{tier.questions} • {tier.time}</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-charcoal-800 mr-2">✓</span>
                    <span className="text-charcoal-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {tier.isMainTest ? (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full py-3 bg-charcoal-800 text-white rounded-lg hover:bg-charcoal-900 transition-colors"
                >
                  {tier.buttonText}
                </button>
              ) : (
                <Link to={tier.link} className="block">
                  <button className="w-full py-3 bg-charcoal-800 text-white rounded-lg hover:bg-charcoal-900 transition-colors">
                    {tier.buttonText}
                  </button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* How It Works Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="font-serif text-3xl text-charcoal-800 text-center mb-12">
            How It Works
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Your Path', desc: 'Start with Discovery or dive into Core' },
              { step: '2', title: 'Answer Questions', desc: 'Thoughtful questions about your preferences' },
              { step: '3', title: 'Get Results', desc: 'Instant, scientifically-grounded insights' },
              { step: '4', title: 'Compare & Grow', desc: 'Join teams and unlock premium features' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-charcoal-800">{item.step}</span>
                </div>
                <h4 className="font-semibold text-charcoal-800 mb-2">{item.title}</h4>
                <p className="text-sm text-charcoal-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual Section with Laptop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-charcoal-50 rounded-3xl p-8 lg:p-12 mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Laptop Illustration */}
            <div className="relative">
              <div className="bg-charcoal-200 rounded-lg p-4">
                <div className="bg-white rounded aspect-video flex items-center justify-center">
                  {/* Simple line art of assessment interface */}
                  <svg viewBox="0 0 400 250" className="w-full h-full p-8" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#525252" strokeWidth="1.5" fill="none">
                      {/* Browser frame */}
                      <rect x="20" y="20" width="360" height="210" rx="5" />
                      <line x1="20" y1="50" x2="380" y2="50" />
                      <circle cx="40" cy="35" r="5" />
                      <circle cx="60" cy="35" r="5" />
                      <circle cx="80" cy="35" r="5" />
                      
                      {/* Question interface */}
                      <rect x="50" y="80" width="300" height="30" rx="15" fill="#F5D659" />
                      <rect x="50" y="130" width="300" height="10" rx="5" />
                      <rect x="50" y="150" width="250" height="10" rx="5" />
                      <rect x="50" y="170" width="280" height="10" rx="5" />
                      
                      {/* Progress circles */}
                      <circle cx="100" cy="210" r="5" fill="#525252" />
                      <circle cx="120" cy="210" r="5" />
                      <circle cx="140" cy="210" r="5" />
                      <circle cx="160" cy="210" r="5" />
                      <circle cx="180" cy="210" r="5" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-serif text-2xl lg:text-3xl text-charcoal-800 mb-6">
                What's Included
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-charcoal-800 rounded-full"></div>
                    <span className="text-charcoal-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Who It's For Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-6 text-center">WHO IT'S FOR</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-800 text-center mb-12">
            Made for People <em>Like You</em>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* This Is For You */}
            <div className="bg-yellow-500 rounded-3xl p-8 lg:p-10">
              <h3 className="font-serif text-2xl text-charcoal-800 mb-6 italic">
                This Is for You If...
              </h3>
              <ul className="space-y-4">
                {[
                  "You're an introspective self-explorer",
                  "You crave honest self-understanding",
                  "You want to improve relationships",
                  "You value personal growth",
                  "You enjoy comparing with friends/teams",
                  "You seek career alignment"
                ].map((item, index) => (
                  <li key={index} className="bg-white rounded-full px-4 py-2 text-sm text-charcoal-700 inline-block mr-2 mb-2">
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Simple illustration */}
              <div className="mt-8 flex justify-center">
                <svg viewBox="0 0 200 150" className="w-48" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                    <circle cx="100" cy="50" r="25" />
                    <path d="M100 75 L100 120" />
                    <path d="M100 85 L80 100 M100 85 L120 100" />
                    <path d="M85 40 Q100 30 115 40" fill="#1A1A1A" />
                  </g>
                </svg>
              </div>
            </div>

            {/* This Is NOT For You */}
            <div className="bg-white border border-charcoal-200 rounded-3xl p-8 lg:p-10">
              <h3 className="font-serif text-2xl text-charcoal-800 mb-6 italic">
                This Is NOT for You If...
              </h3>
              <ul className="space-y-4">
                {[
                  "You're looking for quick labels",
                  "You want surface-level results",
                  "You're not open to self-reflection",
                  "You prefer simple personality tests"
                ].map((item, index) => (
                  <li key={index} className="border border-charcoal-300 rounded-full px-4 py-2 text-sm text-charcoal-600 inline-block mr-2 mb-2">
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Simple illustration */}
              <div className="mt-8 flex justify-center opacity-50">
                <svg viewBox="0 0 200 150" className="w-48" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#525252" strokeWidth="2" fill="none">
                    <rect x="50" y="30" width="100" height="90" rx="10" />
                    <line x1="70" y1="60" x2="130" y2="60" />
                    <line x1="70" y1="80" x2="130" y2="80" />
                    <line x1="70" y1="100" x2="100" y2="100" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10">
          <div className="absolute top-40 right-20">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 5 L32 25 L52 23 L35 30 L52 37 L32 35 L30 55 L28 35 L8 37 L25 30 L8 23 L28 25 Z" 
                stroke="#E5E5E5" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute bottom-40 left-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2 L21 18 L37 17 L22 20 L37 23 L21 22 L20 38 L19 22 L3 23 L18 20 L3 17 L19 18 Z" 
                fill="#F5D659" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;