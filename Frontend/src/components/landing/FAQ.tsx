import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'HOW DOES THE ASSESSMENT WORK?',
      answer: 'Our comprehensive assessment takes 20-25 minutes and includes 200 carefully designed questions. We combine the Big Five model for core traits, MBTI for cognitive preferences, and Jungian analysis for deeper psychological patterns.'
    },
    {
      question: 'CAN I TAKE IT WITHOUT AN ACCOUNT?',
      answer: 'Yes! You can take the assessment anonymously. Creating an account is optional and only needed if you want to save your progress or access your results later.'
    },
    {
      question: 'IS THERE SCIENTIFIC BACKING?',
      answer: 'Absolutely. We use validated psychometric instruments including the Big Five model with decades of research, Item Response Theory (IRT) for precise scoring, and factor mixture modeling for nuanced insights.'
    },
    {
      question: 'WHAT IF I CAN\'T FINISH IN ONE SESSION?',
      answer: 'If you have an account, your progress is automatically saved. You can return anytime to continue where you left off. Anonymous users will need to complete it in one session.'
    },
    {
      question: 'WHO ARE THE EXPERTS BEHIND THIS?',
      answer: 'Our assessment was developed by a team of psychologists, data scientists, and personality researchers. The methodology combines established frameworks with modern statistical techniques.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Header and illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-charcoal-600 uppercase tracking-wide mb-3">NEED MORE INFO?</p>
            <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-800 mb-2">
              Frequently Asked
            </h2>
            <h2 className="font-serif text-4xl lg:text-6xl text-charcoal-800 italic mb-12">
              Questions
            </h2>

            {/* Decorative illustration */}
            <div className="relative mt-12">
              <svg viewBox="0 0 300 300" className="w-64 h-64" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                  {/* Central figure */}
                  <circle cx="150" cy="100" r="30" />
                  <path d="M150 130 L150 200" />
                  <path d="M150 150 L120 170 M150 150 L180 170" />

                  {/* Question marks floating around */}
                  <text x="80" y="60" fontSize="24" fill="#1A1A1A" fontFamily="serif">?</text>
                  <text x="220" y="80" fontSize="20" fill="#1A1A1A" fontFamily="serif">?</text>
                  <text x="60" y="140" fontSize="18" fill="#1A1A1A" fontFamily="serif">?</text>
                  <text x="240" y="160" fontSize="22" fill="#1A1A1A" fontFamily="serif">?</text>

                  {/* Thought bubbles */}
                  <circle cx="190" cy="50" r="8" />
                  <circle cx="210" cy="40" r="6" />
                  <circle cx="225" cy="35" r="4" />
                </g>
              </svg>

              {/* Star decorations */}
              <div className="absolute -top-4 right-0">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 5 L32 25 L52 23 L35 30 L52 37 L32 35 L30 55 L28 35 L8 37 L25 30 L8 23 L28 25 Z"
                    fill="#1A1A1A" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-20">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2 L21 18 L37 17 L22 20 L37 23 L21 22 L20 38 L19 22 L3 23 L18 20 L3 17 L19 18 Z"
                    stroke="#1A1A1A" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Right side - FAQ items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-yellow-500'
                    : 'bg-white border border-charcoal-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <h3 className={`text-sm font-semibold tracking-wider ${
                    openIndex === index ? 'text-charcoal-800' : 'text-charcoal-700'
                  }`}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      openIndex === index
                        ? 'border-charcoal-800 text-charcoal-800'
                        : 'border-charcoal-300 text-charcoal-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <p className={`leading-relaxed ${
                          openIndex === index ? 'text-charcoal-700' : 'text-charcoal-600'
                        }`}>
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
      </div>
    </section>
  );
};

export default FAQ;