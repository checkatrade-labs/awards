'use client';

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { NominationFormData } from '@/types/nomination';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step2Props {
  register: UseFormRegister<NominationFormData>;
  watch: UseFormWatch<NominationFormData>;
  errors: FieldErrors<NominationFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2Nominator({
  register,
  watch,
  errors,
  nextStep,
  prevStep
}: Step2Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Step 2: Your Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="nominatorName" className="block text-sm font-medium text-gray-700">
            Your Name
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            id="nominatorName"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('nominator.name', { required: "Your name is required" })}
          />
          {errors.nominator?.name && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nominator.name)}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="nominatorEmail" className="block text-sm font-medium text-gray-700">
            Your Email
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="email"
            id="nominatorEmail"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...register('nominator.email', { 
              required: "Your email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.nominator?.email && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nominator.email)}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
            Your Relationship to the Nominee
            <span className="text-red-600 ml-1">*</span>
          </label>
          <select
            id="relationship"
            {...register('nominator.relationship', { required: "Relationship is required" })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="customer">Customer</option>
            <option value="colleague">Colleague</option>
            <option value="friend">Friend</option>
            <option value="family">Family Member</option>
            <option value="self">Self (I am nominating myself/my company)</option>
          </select>
          {errors.nominator?.relationship && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nominator.relationship)}</p>
          )}
        </div>
      </div>
      
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
          disabled={!watch('nominator.name') || !watch('nominator.email')}
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
