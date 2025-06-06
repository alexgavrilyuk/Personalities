import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestInstructions from './components/TestInstructions';
import QuestionDisplay from './components/QuestionDisplay';
import ProgressBar from './components/ProgressBar';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingScreen from './components/LoadingScreen';
import { api } from './utils/api';
import { Question, QuestionResponse, AssessmentResults } from './types/assessment';

type AppState = 'landing' | 'instructions' | 'test' | 'processing' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = async () => {
    try {
      setError(null);
      setAppState('instructions');
    } catch (err) {
      setError('Failed to start test. Please try again.');
    }
  };

  const handleBeginAssessment = async () => {
    try {
      setError(null);
      setAppState('processing');
      const data = await api.startAssessment();
      setQuestions(data.questions);
      setAppState('test');
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      setAppState('landing');
    }
  };

  const handleAnswer = (response: QuestionResponse) => {
    setResponses([...responses, response]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAssessment([...responses, response]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove the last response
      setResponses(responses.slice(0, -1));
    }
  };

  const submitAssessment = async (allResponses: QuestionResponse[]) => {
    try {
      setAppState('processing');
      const results = await api.submitAssessment(allResponses);
      setResults(results);
      setAppState('results');
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      setAppState('test');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? (currentQuestionIndex + 1) / questions.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                  Discover Your True Self
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
              >
                A comprehensive personality assessment that integrates the Big Five traits, 
                MBTI preferences, and Jungian depth psychology to reveal your unique personality profile.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <button
                  onClick={handleStartTest}
                  className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Begin Your Journey
                </button>
                
                <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    20-25 minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    200 questions
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Private & secure
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {appState === 'instructions' && (
          <TestInstructions onBegin={handleBeginAssessment} />
        )}

        {appState === 'test' && currentQuestion && (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-4 pb-20"
          >
            <div className="max-w-3xl mx-auto">
              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={questions.length} 
                percentage={progress}
              />
              
              <QuestionDisplay
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
                currentAnswer={responses.find(r => r.question_id === currentQuestion.id)}
              />
            </div>
          </motion.div>
        )}

        {appState === 'processing' && <LoadingScreen />}

        {appState === 'results' && results && (
          <ResultsDisplay results={results} />
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;