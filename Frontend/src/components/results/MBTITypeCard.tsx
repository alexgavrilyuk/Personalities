import React from 'react';
import { motion } from 'framer-motion';
import { MBTIResult } from '../../types/assessment';

interface MBTITypeCardProps {
  mbti: MBTIResult;
}

const MBTITypeCard: React.FC<MBTITypeCardProps> = ({ mbti }) => {
  const typeDescriptions: Record<string, { title: string; description: string; strengths: string[] }> = {
    INTJ: {
      title: 'The Architect',
      description: 'Strategic, innovative, and determined. You see the big picture and create systematic approaches to achieve your goals.',
      strengths: ['Strategic thinking', 'Independence', 'Determination', 'Innovation']
    },
    INTP: {
      title: 'The Thinker',
      description: 'Analytical, curious, and inventive. You love exploring theoretical concepts and solving complex problems.',
      strengths: ['Analytical skills', 'Objectivity', 'Creativity', 'Open-mindedness']
    },
    ENTJ: {
      title: 'The Commander',
      description: 'Bold, imaginative, and strong-willed. You are a natural leader who excels at organizing people and resources.',
      strengths: ['Leadership', 'Strategic planning', 'Efficiency', 'Confidence']
    },
    ENTP: {
      title: 'The Debater',
      description: 'Quick-witted, clever, and intellectually curious. You enjoy exploring new ideas and challenging conventional thinking.',
      strengths: ['Innovation', 'Adaptability', 'Intellectual curiosity', 'Communication']
    },
    INFJ: {
      title: 'The Advocate',
      description: 'Insightful, principled, and altruistic. You seek meaning and purpose while helping others reach their potential.',
      strengths: ['Insight', 'Compassion', 'Determination', 'Idealism']
    },
    INFP: {
      title: 'The Mediator',
      description: 'Imaginative, idealistic, and empathetic. You are guided by your values and seek harmony and authenticity.',
      strengths: ['Empathy', 'Creativity', 'Flexibility', 'Passion']
    },
    ENFJ: {
      title: 'The Protagonist',
      description: 'Charismatic, inspiring, and altruistic. You naturally lead by example and help others achieve their goals.',
      strengths: ['Leadership', 'Empathy', 'Communication', 'Reliability']
    },
    ENFP: {
      title: 'The Campaigner',
      description: 'Enthusiastic, creative, and sociable. You bring energy and innovation to everything you do.',
      strengths: ['Enthusiasm', 'Creativity', 'Communication', 'Adaptability']
    },
    ISTJ: {
      title: 'The Logistician',
      description: 'Practical, reliable, and duty-focused. You value tradition and work systematically to maintain order.',
      strengths: ['Reliability', 'Practicality', 'Organization', 'Dedication']
    },
    ISFJ: {
      title: 'The Defender',
      description: 'Warm, responsible, and detail-oriented. You protect and care for others while maintaining harmony.',
      strengths: ['Supportiveness', 'Reliability', 'Patience', 'Practicality']
    },
    ESTJ: {
      title: 'The Executive',
      description: 'Organized, traditional, and results-driven. You excel at managing projects and leading teams efficiently.',
      strengths: ['Organization', 'Leadership', 'Dedication', 'Direct communication']
    },
    ESFJ: {
      title: 'The Consul',
      description: 'Caring, social, and traditional. You create harmony and ensure everyone feels included and supported.',
      strengths: ['Loyalty', 'Warmth', 'Organization', 'Cooperation']
    },
    ISTP: {
      title: 'The Virtuoso',
      description: 'Practical, observant, and hands-on. You excel at understanding how things work and solving practical problems.',
      strengths: ['Problem-solving', 'Adaptability', 'Practicality', 'Independence']
    },
    ISFP: {
      title: 'The Adventurer',
      description: 'Artistic, flexible, and charming. You appreciate beauty and seek authentic self-expression.',
      strengths: ['Creativity', 'Flexibility', 'Sensitivity', 'Independence']
    },
    ESTP: {
      title: 'The Entrepreneur',
      description: 'Energetic, perceptive, and action-oriented. You thrive in dynamic environments and love new experiences.',
      strengths: ['Adaptability', 'Boldness', 'Practicality', 'Sociability']
    },
    ESFP: {
      title: 'The Entertainer',
      description: 'Spontaneous, enthusiastic, and fun-loving. You bring joy to others and live life to the fullest.',
      strengths: ['Enthusiasm', 'Practicality', 'Adaptability', 'Friendliness']
    }
  };

  const typeInfo = typeDescriptions[mbti.primary_type] || {
    title: 'Unique Type',
    description: 'Your personality type represents a unique combination of preferences.',
    strengths: []
  };

  const getDimensionLabel = (dimension: string): string => {
    const labels: Record<string, string> = {
      'E': 'Extraversion',
      'I': 'Introversion',
      'S': 'Sensing',
      'N': 'Intuition',
      'T': 'Thinking',
      'F': 'Feeling',
      'J': 'Judging',
      'P': 'Perceiving'
    };
    return labels[dimension] || dimension;
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-8 text-charcoal-900"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block"
        >
          <div className="text-6xl md:text-8xl font-bold mb-2 tracking-wider">
            {mbti.primary_type}
          </div>
          <div className="text-2xl md:text-3xl font-light opacity-90">
            {typeInfo.title}
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-center mb-8 opacity-95"
      >
        {typeInfo.description}
      </motion.p>

      {/* Dimension Probabilities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(mbti.dimension_probabilities).map(([dimension, probability], index) => (
          <motion.div
            key={dimension}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-charcoal-900/10 backdrop-blur rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold mb-1">{dimension}</div>
            <div className="text-sm opacity-80">{getDimensionLabel(dimension)}</div>
            <div className="text-lg font-semibold mt-2">
              {Math.round(probability * 100)}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strengths */}
      {typeInfo.strengths.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-3 opacity-90">Key Strengths</h3>
          <div className="flex flex-wrap gap-2">
            {typeInfo.strengths.map((strength, index) => (
              <span
                key={index}
                className="bg-charcoal-900/20 backdrop-blur px-3 py-1 rounded-full text-sm"
              >
                {strength}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confidence and Secondary Type */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-6 border-t border-charcoal-900/20 flex justify-between items-center"
      >
        <div>
          <span className="text-sm opacity-80">Confidence: </span>
          <span className="font-semibold">{Math.round(mbti.probability * 100)}%</span>
        </div>
        {mbti.secondary_type && (
          <div>
            <span className="text-sm opacity-80">Also consider: </span>
            <span className="font-semibold">{mbti.secondary_type}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MBTITypeCard;