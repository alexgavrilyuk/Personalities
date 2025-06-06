import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { BigFiveScores } from '../../types/assessment';

interface BigFiveChartProps {
  bigFive: BigFiveScores;
}

const BigFiveChart: React.FC<BigFiveChartProps> = ({ bigFive }) => {
  const data = Object.entries(bigFive.scores).map(([dimension, score]) => ({
    dimension,
    score,
    percentile: bigFive.percentiles[dimension]
  }));

  const getColorForScore = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 30) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getDescriptionForScore = (dimension: string, score: number) => {
    const descriptions: Record<string, Record<string, string>> = {
      Extraversion: {
        high: 'Outgoing, energetic, and sociable',
        medium: 'Balanced between social and solitary',
        low: 'Reserved, reflective, and independent'
      },
      Agreeableness: {
        high: 'Cooperative, trusting, and helpful',
        medium: 'Selective in trust and cooperation',
        low: 'Direct, skeptical, and competitive'
      },
      Conscientiousness: {
        high: 'Organized, disciplined, and reliable',
        medium: 'Flexible between structure and spontaneity',
        low: 'Spontaneous, flexible, and adaptable'
      },
      Neuroticism: {
        high: 'Emotionally reactive and sensitive',
        medium: 'Moderate emotional stability',
        low: 'Emotionally stable and resilient'
      },
      Openness: {
        high: 'Creative, curious, and imaginative',
        medium: 'Balanced between tradition and novelty',
        low: 'Practical, conventional, and focused'
      }
    };

    const level = score >= 70 ? 'high' : score >= 30 ? 'medium' : 'low';
    return descriptions[dimension]?.[level] || '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Big Five Personality Traits</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: '#4b5563', fontSize: 14 }}
              />
              <PolarRadiusAxis 
                domain={[0, 100]} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Radar 
                name="Your Score" 
                dataKey="score" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Scores List */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={item.dimension}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-semibold ${getColorForScore(item.score)}`}>
                    {item.dimension}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getDescriptionForScore(item.dimension, item.score)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(item.score)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(item.percentile)}th percentile
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BigFiveChart;