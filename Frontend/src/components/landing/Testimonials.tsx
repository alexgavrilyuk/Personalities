import React from 'react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Taylor B.',
      role: 'Creative Director',
      content: 'The depth of insight was remarkable. Understanding my cognitive functions helped me realize why certain creative processes work better for me than others.',
      featured: false
    },
    {
      name: 'Samir R.',
      role: 'Software Engineer',
      content: 'Finally, a personality assessment that goes beyond surface labels. The integration of Big Five, MBTI, and Jungian psychology gave me a complete picture of myself.',
      featured: false
    },
    {
      name: 'Renee L.',
      role: 'Clinical Psychologist',
      content: 'The scientific rigor is impressive. As a professional, I appreciate how this tool combines validated frameworks into actionable insights.',
      featured: true
    },
    {
      name: 'Alex M.',
      role: 'Entrepreneur',
      content: 'Understanding my personality clusters and shadow functions was game-changing. I now approach challenges with much more self-awareness.',
      featured: false
    },
    {
      name: 'Jordan K.',
      role: 'HR Director',
      content: 'This assessment helped me understand not just who I am, but why I react the way I do. The development suggestions were spot-on and practical.',
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-charcoal-50">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-3">TESTIMONIALS</p>
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-800">
            What Our Members 
          </h2>
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-800 italic">
            Are Saying
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${testimonial.featured ? 'lg:col-span-1 lg:row-span-2' : ''}`}
            >
              <div className="bg-white rounded-2xl p-8 h-full flex flex-col">
                <div className="flex-1">
                  <p className="text-charcoal-700 leading-relaxed mb-6 text-lg">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="pt-4 border-t border-charcoal-100">
                  <p className="text-charcoal-800 font-medium">
                    — {testimonial.name}
                  </p>
                  <p className="text-charcoal-600 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
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
          <p className="text-charcoal-600 text-lg">
            Join thousands who have discovered their authentic selves
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-32"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2 L21 18 L37 17 L22 20 L37 23 L21 22 L20 38 L19 22 L3 23 L18 20 L3 17 L19 18 Z" 
                stroke="#E5E5E5" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;