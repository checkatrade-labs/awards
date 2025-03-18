'use client';

import { useCallback } from 'react';
import { Control, UseFormWatch, FieldErrors } from 'react-hook-form';
import { NominationFormData } from '@/types/nomination';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Controller } from 'react-hook-form';
import JustificationField from '../JustificationField';

interface Step4Props {
  control: Control<NominationFormData>;
  watch: UseFormWatch<NominationFormData>;
  errors: FieldErrors<NominationFormData>;
  handleJustificationQualityCheck: (isHighQuality: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step4Justification({
  control,
  watch,
  errors,
  handleJustificationQualityCheck,
  nextStep,
  prevStep
}: Step4Props) {
  const justification = watch('justification');
  
  // We'll memoize the quality check handler to prevent infinite update loops
  // This ensures the callback maintains the same reference between renders
  // as long as handleJustificationQualityCheck remains the same
  const memoizedQualityCheckHandler = useCallback((isHighQuality: boolean) => {
    handleJustificationQualityCheck(isHighQuality);
  }, [handleJustificationQualityCheck]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Step 4: Tell Us Why They Deserve This Award</h2>
      
      <Controller
        name="justification"
        control={control}
        rules={{ 
          required: "Please provide a justification for your nomination",
          minLength: {
            value: 50,
            message: "Please provide at least 50 characters"
          }
        }}
        render={({ field }) => (
          <JustificationField
            value={field.value}
            onChange={field.onChange}
            onQualityCheck={memoizedQualityCheckHandler}
          />
        )}
      />
      
      {errors.justification && (
        <p className="mt-1 text-sm text-red-600">Please provide a justification for your nomination</p>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous Step
          </div>
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!justification || justification.length < 50}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            Next Step
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
