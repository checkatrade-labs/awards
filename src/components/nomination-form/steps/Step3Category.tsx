'use client';

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { NominationFormData } from '@/types/nomination';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Mock award categories - would come from API or database in production
const AWARD_CATEGORIES = [
  { id: 'tradesperson', name: 'Tradesperson of the Year', allowsSelfNomination: false },
  { id: 'customer-service', name: 'Excellence in Customer Service', allowsSelfNomination: false },
  { id: 'quality', name: 'Quality Craftsmanship Award', allowsSelfNomination: false },
  { id: 'rising-star', name: 'Rising Star', allowsSelfNomination: true },
  { id: 'community-hero', name: 'Community Hero', allowsSelfNomination: true },
  { id: 'sustainability', name: 'Sustainability Champion', allowsSelfNomination: true },
  { id: 'technology', name: 'Technology Innovation', allowsSelfNomination: true },
  { id: 'women-in-trade', name: 'Women in Trade', allowsSelfNomination: true },
];

interface Step3Props {
  register: UseFormRegister<NominationFormData>;
  watch: UseFormWatch<NominationFormData>;
  errors: FieldErrors<NominationFormData>;
  setValue: UseFormSetValue<NominationFormData>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Category({
  register,
  watch,
  errors,
  setValue,
  nextStep,
  prevStep
}: Step3Props) {
  const relationship = watch('nominator.relationship');
  const awardCategory = watch('awardCategory');
  
  // Filter categories based on relationship (self-nominations)
  const availableCategories = AWARD_CATEGORIES.filter(category => 
    relationship !== 'self' || category.allowsSelfNomination
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Step 3: Award Category</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Award Category
          <span className="text-red-600 ml-1">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {availableCategories.map((category) => (
            <div 
              key={category.id}
              className={`
                border rounded-md p-3 cursor-pointer transition-colors
                ${awardCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
              onClick={() => setValue('awardCategory', category.id)}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  id={`award-${category.id}`}
                  value={category.id}
                  {...register('awardCategory', { required: "Please select an award category" })}
                  className="mt-1"
                />
                <label 
                  htmlFor={`award-${category.id}`}
                  className="ml-2 block cursor-pointer"
                >
                  <div className="font-medium text-gray-900">{category.name}</div>
                  {category.allowsSelfNomination && (
                    <div className="text-xs text-gray-500 mt-1">
                      (Allows self-nomination)
                    </div>
                  )}
                </label>
              </div>
            </div>
          ))}
        </div>
        {errors.awardCategory && (
          <p className="mt-1 text-sm text-red-600">Please select an award category</p>
        )}
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
        <div>
          <button
            type="button"
            onClick={nextStep}
            disabled={!awardCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              Next Step
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
