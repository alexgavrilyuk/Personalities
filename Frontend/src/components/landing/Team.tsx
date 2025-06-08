import React from 'react';
import { motion } from 'framer-motion';

const Team: React.FC = () => {
  const team = [
    {
      name: 'Dr. Elena Martinez',
      role: 'Chief Psychologist',
      bio: '15+ years in personality psychology research. PhD from Stanford, specializing in psychometric assessment design.',
      linkedin: '#'
    },
    {
      name: 'James Chen',
      role: 'Lead Data Scientist',
      bio: '10+ years in machine learning and statistical modeling. Expert in IRT models and psychological data analysis.',
      linkedin: '#'
    },
    {
      name: 'Dr. Sarah Williams',
      role: 'Clinical Advisor',
      bio: 'Licensed clinical psychologist with expertise in Jungian analysis and depth psychology interpretation.',
      linkedin: '#'
    },
    {
      name: 'Marcus Thompson',
      role: 'Head of Research',
      bio: 'Published researcher in personality psychology. Focuses on Big Five and MBTI integration methodologies.',
      linkedin: '#'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Behavioral Scientist',
      bio: 'Specialist in cognitive functions and personality development. PhD in Behavioral Psychology from MIT.',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'UX Psychology Lead',
      bio: 'Expert in psychological assessment design and user experience. Ensures assessments are engaging and accurate.',
      linkedin: '#'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-block px-6 py-2 bg-lime-400 text-dark-900 font-semibold rounded-full text-sm mb-4">
            Team
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            Meet the Experts Behind Our Assessment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            Our team combines decades of experience in psychology, data science, 
            and behavioral research to create the most comprehensive personality assessment available.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-6">
                {/* Avatar with decorative elements */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform" />
                  <div className="absolute inset-0 w-16 h-16 bg-dark-900 rounded-2xl flex items-center justify-center">
                    <span className="text-lime-400 text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                {/* LinkedIn Icon */}
                <a
                  href={member.linkedin}
                  className="ml-auto p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-lime-400 hover:text-dark-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              <h3 className="text-xl font-bold text-dark-900 mb-2">{member.name}</h3>
              <p className="text-lime-600 font-semibold mb-4">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            Want to join our team of experts?
          </p>
          <a
            href="#"
            className="inline-flex items-center text-lime-600 hover:text-lime-700 font-semibold"
          >
            View open positions
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;