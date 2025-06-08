import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqs = [
    {
      question: 'How does this assessment work?',
      answer: 'Our assessment combines three scientifically validated approaches: the Big Five model measures your core personality traits, MBTI identifies your cognitive preferences, and Jungian analysis explores deeper psychological patterns. You\'ll answer 200 carefully designed questions that take about 20-25 minutes to complete.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. We take your privacy seriously. Your assessment results are processed in real-time and are only stored if you create an account. We use industry-standard encryption, and we never share your personal data with third parties. You can take the assessment anonymously if you prefer.'
    },
    {
      question: 'How accurate are the results?',
      answer: 'Our assessment uses scientifically validated psychometric instruments with high reliability scores. The Big Five model has decades of research support, and we use advanced statistical methods including Item Response Theory (IRT) for precise scoring. However, remember that personality is complex and these results provide insights, not absolute definitions.'
    },
    {
      question: 'What will I learn about myself?',
      answer: 'You\'ll receive comprehensive insights including: your Big Five personality profile with detailed trait analysis, your MBTI type with cognitive function stack, Jungian archetypes and psychological patterns, personality cluster analysis, and personalized development suggestions based on your unique profile.'
    },
    {
      question: 'Can I retake the assessment?',
      answer: 'Yes, you can retake the assessment at any time. However, we recommend waiting at least 3-6 months between assessments as personality traits tend to be relatively stable over short periods. Taking it too frequently may not show meaningful changes.'
    },
    {
      question: 'How is this different from other personality tests?',
      answer: 'Unlike simple personality quizzes, our assessment integrates multiple psychological frameworks to provide a holistic view of your personality. We use advanced scoring algorithms, provide confidence intervals for all measurements, and offer depth that goes beyond surface-level categorization.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-6 py-2 bg-lime-400 text-dark-900 font-semibold rounded-full text-sm mb-4">
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our personality assessment
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? 'border-lime-400 bg-lime-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-dark-900 pr-4">
                  <span className="text-2xl font-bold text-gray-400 mr-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? 'bg-lime-400 text-dark-900'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-gray-600 leading-relaxed pl-12">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;