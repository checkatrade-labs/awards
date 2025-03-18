'use client';

import { JustificationFeedback } from '@/types/nomination';

interface FeedbackSuggestionsProps {
  feedback: JustificationFeedback | null;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  onImprove: () => void;
}

export default function FeedbackSuggestions({
  feedback,
  showSuggestions,
  setShowSuggestions,
  onImprove
}: FeedbackSuggestionsProps) {
  if (!feedback || !showSuggestions || !feedback.suggestions?.length) return null;

  return (
    <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-100 animate-fadeIn">
      <h4 className="font-medium text-blue-800 mb-2">Suggestions to Improve Your Nomination</h4>
      <ul className="space-y-2">
        {feedback.suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mr-2 mt-0.5">
              {index + 1}
            </span>
            <span className="text-sm text-blue-700">{suggestion}</span>
          </li>
        ))}
      </ul>
      
      {feedback.criteriaAlignment && (
        <div className="mt-5 bg-white p-3 rounded-md border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-3">Award Criteria Alignment</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">Trust</p>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(feedback.criteriaAlignment.trust * 10)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    feedback.criteriaAlignment.trust >= 0.8 ? 'bg-green-600' : 
                    feedback.criteriaAlignment.trust >= 0.6 ? 'bg-yellow-500' : 
                    'bg-orange-500'
                  }`}
                  style={{ width: `${feedback.criteriaAlignment.trust * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">How well your nomination demonstrates trustworthiness</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">Quality</p>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(feedback.criteriaAlignment.quality * 10)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    feedback.criteriaAlignment.quality >= 0.8 ? 'bg-green-600' : 
                    feedback.criteriaAlignment.quality >= 0.6 ? 'bg-yellow-500' : 
                    'bg-orange-500'
                  }`}
                  style={{ width: `${feedback.criteriaAlignment.quality * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">How well your nomination highlights work quality</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">Reliability</p>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(feedback.criteriaAlignment.reliability * 10)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    feedback.criteriaAlignment.reliability >= 0.8 ? 'bg-green-600' : 
                    feedback.criteriaAlignment.reliability >= 0.6 ? 'bg-yellow-500' : 
                    'bg-orange-500'
                  }`}
                  style={{ width: `${feedback.criteriaAlignment.reliability * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">How well your nomination emphasizes reliability</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="text-sm bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mr-2 transition-colors"
          onClick={() => setShowSuggestions(false)}
        >
          Continue anyway
        </button>
        <button
          type="button"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={onImprove}
        >
          Improve my nomination
        </button>
      </div>
    </div>
  );
}
