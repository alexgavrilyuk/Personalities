import React from 'react';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Big Five Assessment',
      description: 'Comprehensive analysis of your core personality traits based on the scientifically validated Five-Factor Model.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="3" rx="10" />
          <circle cx="35" cy="35" r="5" fill="currentColor" />
          <circle cx="65" cy="35" r="5" fill="currentColor" />
          <circle cx="35" cy="65" r="5" fill="currentColor" />
          <circle cx="65" cy="65" r="5" fill="currentColor" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </svg>
      ),
      bgColor: 'bg-dark-900',
      textColor: 'text-white',
      accentColor: 'text-lime-400'
    },
    {
      title: 'MBTI Type Analysis',
      description: 'Discover your cognitive preferences and understand how you perceive and judge the world around you.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30 30 L70 30 L50 60 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="30" cy="30" r="8" fill="currentColor" />
          <circle cx="70" cy="30" r="8" fill="currentColor" />
          <circle cx="50" cy="60" r="8" fill="currentColor" />
          <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1="30" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="60" x2="30" y2="30" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      bgColor: 'bg-gray-100',
      textColor: 'text-dark-900',
      accentColor: 'text-dark-900'
    },
    {
      title: 'Jungian Depth Psychology',
      description: 'Explore your unconscious patterns, archetypes, and the deeper layers of your psyche.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <path d="M50 20 Q65 35, 50 50 T50 80" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 50 Q35 35, 50 50 T80 50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      bgColor: 'bg-lime-400',
      textColor: 'text-dark-900',
      accentColor: 'text-dark-900'
    },
    {
      title: 'Cognitive Functions',
      description: 'Understand your mental processes and how you naturally prefer to think, feel, and make decisions.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="3" rx="5" />
          <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="2" />
          <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="40" r="5" fill="currentColor" />
          <circle cx="40" cy="60" r="5" fill="currentColor" />
          <circle cx="60" cy="60" r="5" fill="currentColor" />
        </svg>
      ),
      bgColor: 'bg-dark-900',
      textColor: 'text-white',
      accentColor: 'text-lime-400'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-6 py-2 bg-lime-400 text-dark-900 font-semibold rounded-full text-sm mb-4">
            Services
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            Comprehensive Personality Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our assessment integrates multiple psychological frameworks to provide 
            you with the most complete understanding of your personality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${service.bgColor} rounded-3xl p-8 ${service.textColor} relative overflow-hidden group`}
            >
              <div className="relative z-10">
                <div className={`w-20 h-20 mb-6 ${service.accentColor}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className={`${service.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {service.description}
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`inline-flex items-center mt-6 ${service.accentColor} font-semibold cursor-pointer`}
                >
                  <span>Learn more</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 20L20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-dark-900 mb-4">
            Ready to discover your complete personality profile?
          </h3>
          <p className="text-gray-600 mb-8">
            Take our comprehensive assessment and unlock insights across all dimensions
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;