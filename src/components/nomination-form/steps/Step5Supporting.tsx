'use client';

import { Control } from 'react-hook-form';
import { NominationFormData } from '@/types/nomination';
import { ArrowLeft, Loader, Send } from 'lucide-react';
import { Controller } from 'react-hook-form';
import ImageUpload from '../ImageUpload';

interface Step5Props {
  control: Control<NominationFormData>;
  isSubmitting: boolean;
  prevStep: () => void;
}

export default function Step5Supporting({
  control,
  isSubmitting,
  prevStep
}: Step5Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Step 5: Supporting Materials</h2>
      
      <Controller
        name="media"
        control={control}
        render={({ field }) => (
          <ImageUpload
            images={field.value || []}
            onChange={field.onChange}
            maxImages={5}
          />
        )}
      />
      
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
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader className="animate-spin mr-2 h-4 w-4 text-white" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Submit Nomination
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
