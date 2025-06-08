import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'This assessment gave me profound insights into my personality that I had never considered before. The combination of Big Five, MBTI, and Jungian analysis provided a complete picture of who I am.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Director',
      content: 'The depth of analysis is incredible. It helped me understand not just my strengths, but also my blind spots and areas for growth. The personalized development suggestions were particularly valuable.',
      rating: 5
    },
    {
      name: 'Emily Thompson',
      role: 'Clinical Psychologist',
      content: 'As a professional in the field, I\'m impressed by the scientific rigor and accuracy of this assessment. It successfully integrates multiple psychological frameworks in a meaningful way.',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Entrepreneur',
      content: 'Understanding my cognitive functions and personality type has transformed how I approach business decisions and team building. This tool is invaluable for personal and professional growth.',
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      role: 'HR Manager',
      content: 'The insights from this assessment have helped me become a better leader and communicator. I now understand why I work the way I do and how to leverage my natural strengths.',
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="inline-block px-6 py-2 bg-lime-400 text-dark-900 font-semibold rounded-full text-sm">
            Testimonials
          </span>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-900">
              Hear from Our Community
            </h2>
            <p className="text-gray-600 mt-2">
              Real stories from people who discovered their true selves
            </p>
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="bg-dark-900 rounded-3xl p-8 lg:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Show 3 testimonials on desktop, 1 on mobile */}
                {[0, 1, 2].map((offset) => {
                  const index = (currentIndex + offset) % testimonials.length;
                  const testimonial = testimonials[index];
                  const isCenter = offset === 1;
                  
                  return (
                    <div
                      key={index}
                      className={`${offset !== 0 ? 'hidden lg:block' : ''} ${
                        isCenter ? 'lg:scale-105' : 'lg:opacity-70'
                      } transition-all duration-300`}
                    >
                      <div className="bg-dark-800 rounded-2xl p-6 border border-lime-400/20">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < testimonial.rating ? 'text-lime-400' : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full" />
                          <div>
                            <h4 className="text-white font-semibold">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-dark-800 text-lime-400 hover:bg-dark-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-lime-400'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-dark-800 text-lime-400 hover:bg-dark-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;