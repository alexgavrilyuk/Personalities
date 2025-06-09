import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How long does the assessment take?',
      answer: 'The full assessment consists of 200 questions and typically takes 20-30 minutes to complete. You can save your progress and return later if you have an account.'
    },
    {
      question: 'Can I retake the assessment?',
      answer: 'Yes, you can take the assessment multiple times. Each assessment is saved separately so you can track changes in your personality over time.'
    },
    {
      question: 'How accurate are the results?',
      answer: 'Our assessment uses scientifically validated questions and advanced statistical methods. However, personality is complex and contextual. Results should be viewed as insights rather than absolute definitions.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Absolutely. We use industry-standard encryption and never share your personal data. You can also take the assessment without creating an account if you prefer.'
    },
    {
      question: 'What makes this assessment different?',
      answer: 'We integrate three major personality frameworks (Big Five, MBTI, and Jungian psychology) using advanced statistical methods like Item Response Theory to provide the most comprehensive personality insights available.'
    },
    {
      question: 'Can I download my results?',
      answer: 'Yes! Once you complete the assessment, you can download your results as a PDF report. Account holders can access their results anytime from their dashboard.'
    }
  ];

  const technicalSteps = [
    'Try refreshing the page',
    'Clear your browser cache and cookies',
    'Make sure you\'re using a modern browser (Chrome, Firefox, Safari, Edge)',
    'Check your internet connection',
    'Disable browser extensions that might interfere',
    'Try using an incognito/private browsing window'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="bg-charcoal-50 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-4">SUPPORT CENTER</p>
            <h1 className="font-serif text-5xl lg:text-7xl text-charcoal-800 mb-6">
              We're Here to <em>Help</em>
            </h1>
            <p className="text-xl text-charcoal-600 leading-relaxed max-w-3xl">
              Find answers to common questions, troubleshooting tips, and ways to contact 
              our support team for personalized assistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-charcoal-800 mb-4">
              Frequently Asked <em>Questions</em>
            </h2>
            <p className="text-lg text-charcoal-600">
              Quick answers to help you get started and make the most of your assessment.
            </p>
          </motion.div>

          <div className="max-w-3xl">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left bg-white rounded-2xl p-6 border border-charcoal-200 hover:border-charcoal-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl text-charcoal-800">{faq.question}</h3>
                    <motion.svg
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 mt-1"
                    >
                      <path d="M6 9L12 15L18 9" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-charcoal-600 mt-4 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-yellow-500">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-800 mb-6">
                Still Have <em>Questions?</em>
              </h2>
              <p className="text-lg text-charcoal-700 mb-8">
                Our support team is here to help you with any questions or concerns. 
                We typically respond within 24-48 hours.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-charcoal-800 mb-2">Email Support</h3>
                  <a href="mailto:support@personalityassessment.com" className="text-charcoal-700 hover:text-charcoal-900 transition-colors">
                    support@personalityassessment.com
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-charcoal-800 mb-2">Response Time</h3>
                  <p className="text-charcoal-700">
                    Monday - Friday: 24-48 hours<br />
                    Weekends: 48-72 hours
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Contact illustration */}
              <div className="bg-white rounded-3xl p-12 relative">
                <svg viewBox="0 0 300 250" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                    {/* Envelope */}
                    <rect x="50" y="80" width="200" height="120" rx="10" />
                    <path d="M50 90 L150 150 L250 90" />
                    
                    {/* Message lines */}
                    <line x1="80" y1="120" x2="220" y2="120" strokeWidth="1" opacity="0.5" />
                    <line x1="80" y1="140" x2="180" y2="140" strokeWidth="1" opacity="0.5" />
                    <line x1="80" y1="160" x2="200" y2="160" strokeWidth="1" opacity="0.5" />
                    
                    {/* Decorative elements */}
                    <circle cx="150" cy="40" r="15" fill="#F5D659" />
                    <path d="M145 40 L150 45 L160 35" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-charcoal-800 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Support Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-4">TROUBLESHOOTING</p>
              <h2 className="font-serif text-3xl lg:text-4xl text-charcoal-800">
                Technical <em>Issues?</em>
              </h2>
            </div>

            <div className="bg-charcoal-50 rounded-3xl p-8 lg:p-12">
              <p className="text-lg text-charcoal-700 mb-8">
                If you're experiencing technical difficulties, try these steps:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {technicalSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold text-charcoal-800">{index + 1}</span>
                    </div>
                    <span className="text-charcoal-700">{step}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-charcoal-200">
                <p className="text-charcoal-600">
                  Still having issues? Email us at{' '}
                  <a href="mailto:support@personalityassessment.com" className="text-charcoal-800 font-medium hover:underline">
                    support@personalityassessment.com
                  </a>{' '}
                  with a description of the problem and your browser information.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal-800 text-white">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl mb-6">
              Ready to Begin Your <em>Journey?</em>
            </h2>
            <p className="text-xl text-charcoal-200 mb-8 max-w-2xl mx-auto">
              Take our comprehensive personality assessment and discover insights that will help you grow.
            </p>
            <Link to="/" className="btn-yellow inline-block">
              Start Your Assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Support;