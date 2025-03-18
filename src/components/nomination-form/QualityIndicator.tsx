'use client';

import { JustificationFeedback } from '@/types/nomination';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface QualityIndicatorProps {
  feedback: JustificationFeedback | null;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

export default function QualityIndicator({
  feedback,
  showSuggestions,
  setShowSuggestions
}: QualityIndicatorProps) {
  if (!feedback || feedback.quality === 'error') return null;

  // Map quality to a score out of 100
  const score = 
    feedback.quality === 'good' ? 90 :
    feedback.quality === 'average' ? 60 :
    feedback.quality === 'needs_improvement' ? 30 :
    feedback.quality === 'too_short' ? 10 : 0;
  
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const label = 
    feedback.quality === 'good' ? 'High Quality' :
    feedback.quality === 'average' ? 'Average' :
    feedback.quality === 'needs_improvement' ? 'Needs Improvement' :
    feedback.quality === 'too_short' ? 'Too Short' : 'Unknown';
    
  const emoji = 
    feedback.quality === 'good' ? '👍' :
    feedback.quality === 'average' ? '😐' :
    feedback.quality === 'needs_improvement' ? '🔍' :
    feedback.quality === 'too_short' ? '✏️' : '❓';

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-xl mr-2" aria-hidden="true">{emoji}</span>
          <h4 className="font-medium text-gray-800">{label}</h4>
        </div>
        {feedback.quality !== 'good' && feedback.quality !== 'too_short' && (
          <button 
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            onClick={() => setShowSuggestions(!showSuggestions)}
            aria-expanded={showSuggestions}
          >
            {showSuggestions ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Suggestions
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Suggestions
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${score}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getScoreColor()}`}
          ></div>
        </div>
        <div className="flex text-xs justify-between">
          <span className="text-gray-600">Needs work</span>
          <span className="text-gray-600">Excellent</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mt-2">
        {feedback.feedback}
      </p>
    </div>
  );
}
