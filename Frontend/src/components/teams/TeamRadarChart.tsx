import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TeamRadarChartProps {
  data: Record<string, number>;
  title?: string;
  comparisonData?: Record<string, number>;
}

const TeamRadarChart: React.FC<TeamRadarChartProps> = ({ data, title, comparisonData }) => {
  // Transform data for recharts
  const chartData = Object.entries(data).map(([trait, value]) => ({
    trait: trait.replace('_', ' '),
    value: value,
    comparison: comparisonData?.[trait] || null
  }));

  return (
    <div>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="trait" className="text-sm" />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Radar
            name="Team Average"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
          {comparisonData && (
            <Radar
              name="Your Score"
              dataKey="comparison"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          )}
          {comparisonData && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamRadarChart;