import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LikertScale from './LikertScale';
import ForcedChoice from './ForcedChoice';
import { Question, QuestionResponse } from '../types/assessment';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (response: QuestionResponse) => void;
  onPrevious?: () => void;
  currentAnswer?: QuestionResponse;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  currentAnswer
}) => {
  const [selectedValue, setSelectedValue] = useState<number | string | null>(null);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedValue(currentAnswer.response_value || currentAnswer.selected_option || null);
    } else {
      setSelectedValue(null);
    }
  }, [question.id, currentAnswer]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedValue !== null) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedValue, question.id]);

  const handleSubmit = () => {
    if (selectedValue === null) return;

    const response: QuestionResponse = {
      question_id: question.id,
    };

    if (question.response_type === 'likert_7' || question.response_type === 'likert_5') {
      response.response_value = selectedValue as number;
    } else if (question.response_type === 'forced_choice') {
      response.selected_option = selectedValue as 'a' | 'b';
    }

    onAnswer(response);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="question-card"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber}
            </span>
            {question.assessment_layer && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                question.assessment_layer === 'primary' ? 'bg-blue-100 text-blue-700' :
                question.assessment_layer === 'secondary' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}>
                {question.assessment_layer === 'primary' ? 'Personality Traits' :
                 question.assessment_layer === 'secondary' ? 'Preferences' :
                 'Depth Psychology'}
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
            {question.text}
          </h3>
        </div>

        <div className="mb-8">
          {question.response_type === 'likert_7' && (
            <LikertScale
              value={selectedValue as number}
              onChange={setSelectedValue}
              labels={[
                'Strongly Disagree',
                'Disagree',
                'Slightly Disagree',
                'Neutral',
                'Slightly Agree',
                'Agree',
                'Strongly Agree'
              ]}
            />
          )}

          {question.response_type === 'likert_5' && (
            <LikertScale
              value={selectedValue as number}
              onChange={setSelectedValue}
              labels={[
                'Never',
                'Rarely',
                'Sometimes',
                'Often',
                'Always'
              ]}
            />
          )}

          {question.response_type === 'forced_choice' && question.option_a && question.option_b && (
            <ForcedChoice
              optionA={question.option_a.text}
              optionB={question.option_b.text}
              selected={selectedValue as 'a' | 'b' | null}
              onSelect={setSelectedValue}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onPrevious && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPrevious}
              className="btn-secondary flex-1 sm:flex-initial"
            >
              Previous
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selectedValue === null}
            className="btn-primary flex-1"
          >
            {questionNumber === totalQuestions ? 'Complete Assessment' : 'Next Question'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionDisplay;