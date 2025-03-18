'use client';

import { useState } from 'react';
import { NominationFormData } from '@/types/nomination';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { isStepComplete } from './formSummaryUtils';
import StepContent from './StepContent';

interface FormSummaryProps {
  currentStep: number;
  formData: NominationFormData;
  onNavigate: (step: number) => void;
  isExpanded?: boolean;
}

export default function FormSummary({ 
  currentStep, 
  formData, 
  onNavigate,
  isExpanded = false
}: FormSummaryProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  // Get step title
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return "Nominee";
      case 2: return "Your Information";
      case 3: return "Award Category";
      case 4: return "Justification";
      case 5: return "Supporting Materials";
      default: return `Step ${step}`;
    }
  };

  return (
    <div className={`border rounded-md bg-white shadow-sm overflow-hidden ${expanded ? 'w-full' : 'w-auto'}`}>
      <div 
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-gray-700">Your Nomination</h3>
        <button 
          type="button"
          className="text-gray-500 hover:text-gray-700"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse summary" : "Expand summary"}
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="divide-y">
          {Array.from({ length: 5 }, (_, i) => i + 1).map(step => {
            const title = getStepTitle(step);
            const complete = isStepComplete(step, currentStep, formData);
            const isCurrent = currentStep === step;
            
            return (
              <div 
                key={step}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${isCurrent ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {complete ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-gray-300'} text-white flex items-center justify-center text-xs font-medium`}>
                        {step}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-medium ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                          {title}
                        </h4>
                        {complete && (
                          <div className="mt-1">
                            <StepContent step={step} formData={formData} />
                          </div>
                        )}
                      </div>
                      
                      {complete && step < currentStep && (
                        <button
                          type="button"
                          onClick={() => onNavigate(step)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
