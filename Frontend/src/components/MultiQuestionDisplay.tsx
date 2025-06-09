import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisualLikertScale from './VisualLikertScale';
import ForcedChoice from './ForcedChoice';
import { Question, QuestionResponse } from '../types/assessment';

interface MultiQuestionDisplayProps {
  questions: Question[];
  startIndex: number;
  totalQuestions: number;
  onSubmit: (responses: QuestionResponse[]) => void;
  onPrevious?: () => void;
  currentResponses?: QuestionResponse[];
}

const QUESTIONS_PER_PAGE = 5; // Show 5 questions at a time on mobile

const MultiQuestionDisplay: React.FC<MultiQuestionDisplayProps> = ({
  questions,
  startIndex,
  totalQuestions,
  onSubmit,
  onPrevious,
  currentResponses = []
}) => {
  const [responses, setResponses] = useState<Map<string, QuestionResponse>>(new Map());
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Initialize with existing responses
    const responseMap = new Map<string, QuestionResponse>();
    currentResponses.forEach(resp => {
      responseMap.set(resp.question_id, resp);
    });
    setResponses(responseMap);
  }, [currentResponses]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Check if all questions are answered
        if (responses.size === questions.length) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [responses, questions.length]);

  const handleResponseChange = (questionId: string, value: number | string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const response: QuestionResponse = {
      question_id: questionId,
    };

    if (question.response_type === 'likert_7' || question.response_type === 'likert_5') {
      response.response_value = value as number;
    } else if (question.response_type === 'forced_choice') {
      response.selected_option = value as 'a' | 'b';
    }

    const newResponses = new Map(responses);
    newResponses.set(questionId, response);
    setResponses(newResponses);
    setShowError(false);
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const answeredCount = responses.size;
    if (answeredCount < questions.length) {
      setShowError(true);
      // Scroll to first unanswered question
      const firstUnanswered = questions.find(q => !responses.has(q.id));
      if (firstUnanswered) {
        const element = document.getElementById(`question-${firstUnanswered.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Convert map to array
    const responseArray = Array.from(responses.values());
    onSubmit(responseArray);
  };

  const getResponseValue = (questionId: string, responseType: string) => {
    const response = responses.get(questionId);
    if (!response) return null;
    
    if (responseType === 'likert_7' || responseType === 'likert_5') {
      return response.response_value || null;
    } else if (responseType === 'forced_choice') {
      return response.selected_option || null;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4"
    >
      {/* Error message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-center"
        >
          <p className="text-red-700 text-sm font-medium">
            Please answer all questions before continuing
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => {
          const isAnswered = responses.has(question.id);
          const needsAnswer = showError && !isAnswered;
          
          return (
            <motion.div
              key={question.id}
              id={`question-${question.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl border transition-all duration-200 ${
                needsAnswer ? 'border-red-300 shadow-sm' : 'border-charcoal-200'
              } p-6`}
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="font-medium text-charcoal-800 leading-relaxed flex-1 pr-4">
                    {question.text}
                  </p>
                  {question.assessment_layer && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      question.assessment_layer === 'primary' ? 'bg-blue-50 text-blue-700' :
                      question.assessment_layer === 'secondary' ? 'bg-purple-50 text-purple-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {question.assessment_layer === 'primary' ? 'Traits' :
                       question.assessment_layer === 'secondary' ? 'Preferences' :
                       'Depth'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {question.response_type === 'likert_7' && (
                  <VisualLikertScale
                    value={getResponseValue(question.id, question.response_type) as number}
                    onChange={(value) => handleResponseChange(question.id, value)}
                    type="7-point"
                  />
                )}

                {question.response_type === 'likert_5' && (
                  <VisualLikertScale
                    value={getResponseValue(question.id, question.response_type) as number}
                    onChange={(value) => handleResponseChange(question.id, value)}
                    type="5-point"
                  />
                )}

                {question.response_type === 'forced_choice' && question.option_a && question.option_b && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResponseChange(question.id, 'a')}
                      className={`p-4 rounded-xl text-sm font-medium transition-all ${
                        getResponseValue(question.id, question.response_type) === 'a'
                          ? 'bg-charcoal-800 text-white'
                          : 'bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100'
                      }`}
                    >
                      {question.option_a.text}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResponseChange(question.id, 'b')}
                      className={`p-4 rounded-xl text-sm font-medium transition-all ${
                        getResponseValue(question.id, question.response_type) === 'b'
                          ? 'bg-charcoal-800 text-white'
                          : 'bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100'
                      }`}
                    >
                      {question.option_b.text}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3 sticky bottom-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-charcoal-200">
        {onPrevious && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrevious}
            className="btn-secondary flex-1"
          >
            Previous
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-primary flex-1"
        >
          {startIndex + questions.length >= totalQuestions ? 'Complete Assessment' : 'Next Questions'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MultiQuestionDisplay;