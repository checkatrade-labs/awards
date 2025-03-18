'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { JustificationFeedback } from '@/types/nomination';
import { aiService } from '@/services/aiService';
import { ShieldCheck, AlertTriangle, Loader } from 'lucide-react';
import QualityIndicator from './QualityIndicator';
import FeedbackSuggestions from './FeedbackSuggestions';

interface JustificationFieldProps {
  value: string;
  onChange: (value: string) => void;
  onQualityCheck?: (isHighQuality: boolean) => void;
}

export default function JustificationField({
  value,
  onChange,
  onQualityCheck,
}: JustificationFieldProps) {
  const [feedback, setFeedback] = useState<JustificationFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const lastTypedRef = useRef<number>(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onQualityCheckRef = useRef(onQualityCheck);
  
  // Update the ref whenever onQualityCheck changes
  useEffect(() => {
    onQualityCheckRef.current = onQualityCheck;
  }, [onQualityCheck]);

  // Function to analyze the justification text
  const analyzeJustification = useCallback(async () => {
    // Skip analysis if text is too short
    if (value.length < 30) {
      setFeedback({
        quality: 'too_short',
        feedback: 'Your nomination is too short. Please provide more details about why this trade deserves recognition.',
        score: 0
      });
      if (onQualityCheckRef.current) onQualityCheckRef.current(false);
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.provideJustificationFeedback(value);
      setFeedback(result);
      
      // Automatically show suggestions if quality needs improvement
      if (result.quality === 'needs_improvement' || result.quality === 'average') {
        setShowSuggestions(true);
      }
      
      // Notify parent component about quality check
      if (onQualityCheckRef.current) {
        onQualityCheckRef.current(result.quality === 'good');
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [value]); // Keep only value as a dependency

  // Reset idle timer on user input - optimize dependency array to avoid unnecessary rerenders
  useEffect(() => {
    lastTypedRef.current = Date.now();
    
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    // Set new idle timer if content is substantial enough to analyze
    if (value.length >= 30) {
      const timer = setTimeout(() => {
        // Only analyze if textarea is still in focus and user hasn't typed for 15 seconds
        if (document.activeElement === textareaRef.current && 
            Date.now() - lastTypedRef.current >= 15000) {
          analyzeJustification();
        }
      }, 15000); // 15 seconds idle time
      
      setIdleTimer(timer);
    }
    
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [value, analyzeJustification]); // Remove idleTimer from dependencies - it's handled within the effect

  // Handle improving nomination
  const handleImprove = () => {
    // Focus back on textarea so user can improve their nomination
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <label 
          htmlFor="justification" 
          className="block text-sm font-medium text-gray-700"
        >
          Why are you nominating this trade?
          <span className="text-red-600 ml-1">*</span>
        </label>
        <div className="flex items-center">
          <span className={`text-xs ${value.length < 50 ? 'text-red-500' : 'text-gray-600'}`}>
            {value.length}/50 minimum
          </span>
          {loading && (
            <span className="text-xs text-gray-600 flex items-center ml-2">
              <Loader className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </span>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="justification"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tell us why this trade deserves recognition. Focus on specific examples that demonstrate their trustworthiness, quality of work, and reliability."
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 min-h-[150px] transition-colors text-gray-800 ${
            value.length < 50 && value.length > 0 
              ? 'border-orange-300 bg-orange-50 focus:ring-orange-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          required
          aria-describedby="justification-hint"
        />
        {value.length > 0 && value.length < 50 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-800 text-xs">
              <AlertTriangle className="h-3 w-3" />
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p id="justification-hint" className="text-xs text-gray-700">
          Strong nominations include specific examples and focus on trust, quality, and reliability.
        </p>
        <button
          type="button"
          onClick={analyzeJustification}
          disabled={loading || value.length < 30}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Check nomination quality"
        >
          <div className="flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1" />
            Check Quality
          </div>
        </button>
      </div>
      
      <QualityIndicator 
        feedback={feedback} 
        showSuggestions={showSuggestions} 
        setShowSuggestions={setShowSuggestions} 
      />
      
      <FeedbackSuggestions 
        feedback={feedback}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onImprove={handleImprove}
      />
    </div>
  );
}
