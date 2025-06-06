import React from 'react';

interface CompactLikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  labels: string[];
}

const CompactLikertScale: React.FC<CompactLikertScaleProps> = ({ value, onChange, labels }) => {
  const getShortLabel = (label: string, index: number) => {
    // For 7-point scale
    if (labels.length === 7) {
      const shortLabels = ['SD', 'D', 'SlD', 'N', 'SlA', 'A', 'SA'];
      return shortLabels[index];
    }
    // For 5-point scale
    if (labels.length === 5) {
      const shortLabels = ['N', 'R', 'S', 'O', 'A'];
      return shortLabels[index];
    }
    return label.substring(0, 3);
  };

  return (
    <div className="flex justify-between gap-1 max-w-md mx-auto">
      {labels.map((label, index) => (
        <button
          key={index}
          onClick={() => onChange(index + 1)}
          className={`flex-1 py-3 px-1 rounded-md text-xs font-medium transition-all ${
            value === index + 1
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={label}
        >
          {getShortLabel(label, index)}
        </button>
      ))}
    </div>
  );
};

export default CompactLikertScale;