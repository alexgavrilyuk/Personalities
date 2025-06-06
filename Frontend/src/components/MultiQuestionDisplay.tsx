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

  useEffect(() => {
    // Initialize with existing responses
    const responseMap = new Map<string, QuestionResponse>();
    currentResponses.forEach(resp => {
      responseMap.set(resp.question_id, resp);
    });
    setResponses(responseMap);
  }, [currentResponses]);

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
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const answeredCount = responses.size;
    if (answeredCount < questions.length) {
      alert(`Please answer all questions before continuing`);
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
      className="max-w-2xl mx-auto px-4"
    >
      {/* Removed question count header */}

      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
          >
            <div className="mb-3">
              <div className="flex items-start justify-end mb-2">
                {question.assessment_layer && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    question.assessment_layer === 'primary' ? 'bg-blue-50 text-blue-600' :
                    question.assessment_layer === 'secondary' ? 'bg-purple-50 text-purple-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {question.assessment_layer === 'primary' ? 'Traits' :
                     question.assessment_layer === 'secondary' ? 'Preferences' :
                     'Depth'}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                {question.text}
              </p>
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
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleResponseChange(question.id, 'a')}
                    className={`p-3 rounded-md text-xs font-medium transition-all ${
                      getResponseValue(question.id, question.response_type) === 'a'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {question.option_a.text}
                  </button>
                  <button
                    onClick={() => handleResponseChange(question.id, 'b')}
                    className={`p-3 rounded-md text-xs font-medium transition-all ${
                      getResponseValue(question.id, question.response_type) === 'b'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {question.option_b.text}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          {startIndex + questions.length >= totalQuestions ? 'Complete' : 'Next'}
        </button>
      </div>
    </motion.div>
  );
};

export default MultiQuestionDisplay;