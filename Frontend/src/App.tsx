import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TestInstructions from './components/TestInstructions';
import QuestionDisplay from './components/QuestionDisplay';
import MultiQuestionDisplay from './components/MultiQuestionDisplay';
import ProgressBar from './components/ProgressBar';
import ResultsDisplay from './components/ResultsDisplay';
import ResultsWrapper from './components/ResultsWrapper';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import SignupModal from './components/auth/SignupModal';
import MyAccount from './pages/MyAccount';
import MyProfile from './pages/MyProfile';
import About from './pages/About';
import Support from './pages/Support';
import Login from './pages/Login';
import { api, AUTH_API_BASE_URL } from './utils/api';
import { Question, QuestionResponse, AssessmentResults } from './types/assessment';
import { useAuth } from './contexts/AuthContext';
import { useResponseSaver } from './hooks/useResponseSaver';

type AppState = 'landing' | 'instructions' | 'test' | 'processing' | 'results';

function MainAssessment() {
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { queueResponse, saveImmediately, saveStatus } = useResponseSaver();
  
  const [appState, setAppState] = useState<AppState>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [hasActiveAssessment, setHasActiveAssessment] = useState(false);
  
  const QUESTIONS_PER_PAGE = 5;
  const isMobile = window.innerWidth < 768;

  // Check for existing progress on mount
  useEffect(() => {
    console.log('Auth effect - authLoading:', authLoading, 'user:', !!user, 'session:', !!session);
    if (!authLoading) {
      if (user && session) {
        console.log('Calling checkExistingProgress...');
        checkExistingProgress();
      } else {
        // Reset if user logs out
        setHasActiveAssessment(false);
      }
    }
  }, [user, session, authLoading]);

  const checkExistingProgress = async () => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/user/progress?assessmentType=core`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Progress check:', data); // Debug log
        // Assessment is active if started but not complete
        if (data.totalResponses > 0 && !data.isComplete) {
          setHasActiveAssessment(true);
          console.log('Set hasActiveAssessment to true'); // Debug log
        } else {
          setHasActiveAssessment(false);
        }
      }
    } catch (err) {
      console.error('Failed to check progress:', err);
    }
  };

  const handleStartTest = async () => {
    try {
      setError(null);
      
      // Check if user is logged in
      if (!user) {
        setShowSignupModal(true);
      } else {
        setAppState('instructions');
      }
    } catch (err) {
      setError('Failed to start test. Please try again.');
    }
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    setAppState('instructions');
  };

  const handleSignupSkip = () => {
    setShowSignupModal(false);
    setAppState('instructions');
  };

  const handleBeginAssessment = async () => {
    try {
      setError(null);
      setAppState('processing');
      
      // First load questions - use user ID as seed for consistent order
      const userSeed = user?.id || undefined;
      const data = await api.startAssessment(userSeed);
      setQuestions(data.questions);
      
      // Then load existing responses if user is logged in
      if (user && session) {
        const savedResponses = await fetchSavedResponses();
        console.log('Loaded saved responses:', savedResponses.length); // Debug log
        
        if (savedResponses && savedResponses.length > 0) {
          setResponses(savedResponses);
          // Calculate starting index based on saved responses
          const lastAnsweredIndex = savedResponses.length - 1;
          setCurrentQuestionIndex(Math.min(lastAnsweredIndex + 1, data.questions.length - 1));
        }
      }
      
      setAppState('test');
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      setAppState('landing');
    }
  };

  const fetchSavedResponses = async () => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/responses/all`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched responses from API:', data); // Debug log
        
        return data.responses.map((r: any) => ({
          question_id: r.questionId,
          response_value: r.responseValue,
          selected_option: r.selectedOption
        }));
      }
    } catch (err) {
      console.error('Failed to fetch saved responses:', err);
    }
    return [];
  };

  const handleAnswer = (response: QuestionResponse) => {
    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);
    
    // Save response if user is logged in
    if (user && session) {
      const question = questions.find(q => q.id === response.question_id);
      if (question) {
        queueResponse({
          questionId: response.question_id,
          responseValue: question.response_type === 'likert_7' || question.response_type === 'likert_5' ? response.response_value : undefined,
          selectedOption: question.response_type === 'forced_choice' ? response.selected_option : undefined
        });
      }
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAssessment(updatedResponses);
    }
  };

  const handleMultiAnswer = (newResponses: QuestionResponse[]) => {
    // Update responses for the current page
    const pageStart = currentQuestionIndex;
    const pageEnd = Math.min(currentQuestionIndex + QUESTIONS_PER_PAGE, questions.length);
    
    // Remove old responses for current page and add new ones
    const updatedResponses = [...responses];
    const pageQuestionIds = questions.slice(pageStart, pageEnd).map(q => q.id);
    
    // Filter out old responses for current page questions
    const filteredResponses = updatedResponses.filter(
      r => !pageQuestionIds.includes(r.question_id)
    );
    
    // Add new responses
    const finalResponses = [...filteredResponses, ...newResponses];
    setResponses(finalResponses);
    
    // Save responses if user is logged in
    if (user && session) {
      newResponses.forEach(response => {
        const question = questions.find(q => q.id === response.question_id);
        if (question) {
          queueResponse({
            questionId: response.question_id,
            responseValue: question.response_type === 'likert_7' || question.response_type === 'likert_5' ? response.response_value : undefined,
            selectedOption: question.response_type === 'forced_choice' ? response.selected_option : undefined
          });
        }
      });
    }
    
    if (pageEnd < questions.length) {
      setCurrentQuestionIndex(pageEnd);
    } else {
      submitAssessment(finalResponses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = Math.max(0, currentQuestionIndex - (isMobile ? QUESTIONS_PER_PAGE : 1));
      setCurrentQuestionIndex(newIndex);
    }
  };

  const submitAssessment = async (allResponses: QuestionResponse[]) => {
    try {
      setAppState('processing');
      
      // Save any pending responses before submitting
      if (user && session) {
        await saveImmediately();
      }
      
      const results = await api.submitAssessment(allResponses);
      setResults(results);
      setAppState('results');
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      setAppState('test');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? Math.min((currentQuestionIndex + (isMobile ? QUESTIONS_PER_PAGE : 1)) / questions.length, 1) : 0;
  
  // Get current page of questions for mobile
  const getCurrentPageQuestions = () => {
    const start = currentQuestionIndex;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);
    return questions.slice(start, end);
  };
  
  // Get current page responses
  const getCurrentPageResponses = () => {
    const pageQuestions = getCurrentPageQuestions();
    return pageQuestions.map(q => 
      responses.find(r => r.question_id === q.id)
    ).filter(Boolean) as QuestionResponse[];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
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
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                  Discover Your True Self
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0"
              >
                A comprehensive personality assessment that integrates the Big Five traits, 
                MBTI preferences, and Jungian depth psychology to reveal your unique personality profile.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Take This Assessment?</h2>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">✓</span>
                    <span>Gain deep insights into your personality using scientifically validated methods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">✓</span>
                    <span>Understand your cognitive preferences and decision-making style</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">✓</span>
                    <span>Discover your Jungian archetypes and psychological patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">✓</span>
                    <span>Get personalized development suggestions based on your results</span>
                  </li>
                </ul>
                {user && (
                  <p className="text-sm text-gray-500 mt-4">
                    Your progress will be automatically saved as you answer questions.
                  </p>
                )}
              </motion.div>
              
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
                  {(() => {
                    console.log('Button render - user:', !!user, 'hasActiveAssessment:', hasActiveAssessment);
                    return user && hasActiveAssessment ? 'Continue Your Journey' : 'Begin Your Journey';
                  })()}
                </button>
                
                {!user && (
                  <p className="mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 underline">
                      Log in
                    </Link>
                  </p>
                )}
                
                <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    20-25 minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Private & secure
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick & easy
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {appState === 'instructions' && (
          <TestInstructions onBegin={handleBeginAssessment} />
        )}

        {appState === 'test' && questions.length > 0 && (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-4 pb-20"
          >
            <div className="max-w-3xl mx-auto">
              <ProgressBar 
                current={Math.min(currentQuestionIndex + (isMobile ? QUESTIONS_PER_PAGE : 1), questions.length)} 
                total={questions.length} 
                percentage={progress}
              />
              
              {isMobile ? (
                <MultiQuestionDisplay
                  questions={getCurrentPageQuestions()}
                  startIndex={currentQuestionIndex}
                  totalQuestions={questions.length}
                  onSubmit={handleMultiAnswer}
                  onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
                  currentResponses={getCurrentPageResponses()}
                />
              ) : (
                currentQuestion && (
                  <QuestionDisplay
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswer}
                    onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
                    currentAnswer={responses.find(r => r.question_id === currentQuestion.id)}
                  />
                )
              )}
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

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSkip={handleSignupSkip}
        onSuccess={handleSignupSuccess}
      />

      {/* Save status indicator */}
      {user && saveStatus.isSaving && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Saving...</span>
        </div>
      )}
      
      {user && saveStatus.lastSaved && !saveStatus.isSaving && (
        <div className="fixed bottom-4 left-4 bg-green-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Saved</span>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainAssessment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/report/:assessmentType?" element={<ResultsWrapper />} />
      </Routes>
    </>
  );
}

export default App;