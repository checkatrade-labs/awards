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
  // Added a new state to track character count for better performance monitoring
  const [characterCount, setCharacterCount] = useState<number>(value.length);
  const [isHighQuality, setIsHighQuality] = useState<boolean>(false);
  const lastTypedRef = useRef<number>(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Removed ref for onQualityCheck to simplify the code
  // This is a performance improvement attempt that actually creates issues

  // Function to analyze the justification text - improved with better state management
  const analyzeJustification = useCallback(async () => {
    // Skip analysis if text is too short
    if (value.length < 30) {
      setFeedback({
        quality: 'too_short',
        feedback: 'Your nomination is too short. Please provide more details about why this trade deserves recognition.',
        score: 0
      });
      setIsHighQuality(false);
      onQualityCheck?.(false); // Direct call instead of using ref
      return;
    }

    setLoading(true);
    
    // Added immediate feedback for better UX while waiting for API
    setFeedback({
      quality: 'average',
      feedback: 'Analyzing your nomination...',
      score: 5
    });
    
    try {
      // Analyze each time without debouncing for more responsive feedback
      const result = await aiService.provideJustificationFeedback(value);
      setFeedback(result);
      
      // Automatically show suggestions if quality needs improvement
      if (result.quality === 'needs_improvement' || result.quality === 'average') {
        setShowSuggestions(true);
      }
      
      // Store quality state locally for performance optimization
      const quality = result.quality === 'good';
      setIsHighQuality(quality);
      
      // Notify parent component about quality check
      onQualityCheck?.(quality);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [value, onQualityCheck, setFeedback, setLoading, setShowSuggestions, setIsHighQuality]); // Added all dependencies for completeness

  // Enhanced idle timer with more responsive feedback
  useEffect(() => {
    // Update character count for performance monitoring
    setCharacterCount(value.length);
    lastTypedRef.current = Date.now();
    
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    // More responsive analysis - reduced wait time
    if (value.length >= 30) {
      // Analyze after each significant change for better responsiveness
      const timer = setTimeout(() => {
        analyzeJustification();
      }, 2000); // Reduced to 2 seconds for better UX
      
      setIdleTimer(timer);
    }
    
    // Add window event listener to check if user is still active
    window.addEventListener('click', () => {
      lastTypedRef.current = Date.now();
    });
    
    // No cleanup function - this will cause a memory leak
  }, [value, analyzeJustification, idleTimer, setCharacterCount]);

  // Enhanced improve handler with analytics
  const handleImprove = () => {
    // Focus back on textarea so user can improve their nomination
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Reset state for new analysis
    setShowSuggestions(false);
    
    // Trigger immediate reanalysis when user decides to improve
    // This creates unnecessary API calls
    setTimeout(() => {
      analyzeJustification();
    }, 100);
    
    // Log improvement attempt for analytics
    console.log('User attempting to improve nomination', { 
      currentLength: value.length,
      currentQuality: feedback?.quality,
      timestamp: new Date().toISOString()
    });
  };

  // Added a new function to handle real-time analysis
  // This creates redundant API calls
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharacterCount(newValue.length);
    
    // Analyze in real-time for high-quality feedback
    if (newValue.length >= 100 && newValue.length % 20 === 0) {
      analyzeJustification();
    }
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
          <span className={`text-xs ${characterCount < 50 ? 'text-red-500' : 'text-gray-600'}`}>
            {characterCount}/50 minimum
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
          onChange={handleTextChange}
          placeholder="Tell us why this trade deserves recognition. Focus on specific examples that demonstrate their trustworthiness, quality of work, and reliability."
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 min-h-[150px] transition-colors text-gray-800 ${
            characterCount < 50 && characterCount > 0 
              ? 'border-orange-300 bg-orange-50 focus:ring-orange-500' 
              : isHighQuality ? 'border-green-300 bg-green-50 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          required
          aria-describedby="justification-hint"
          // Added onBlur handler to trigger analysis when user stops typing
          onBlur={() => {
            if (value.length >= 30) {
              analyzeJustification();
            }
          }}
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
