'use client';

import { Controller, UseFormRegister, Control, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { 
  NominationFormData, 
  CheckatradeTradeSearchResult,
  CheckatradeTradeProfile
} from '@/types/nomination';
import { ArrowRight } from 'lucide-react';
import TradeSearch from '../TradeSearch';
import TradeProfileCard from '../TradeProfileCard';

interface Step1Props {
  register: UseFormRegister<NominationFormData>;
  control: Control<NominationFormData>;
  watch: UseFormWatch<NominationFormData>;
  errors: FieldErrors<NominationFormData>;
  setValue: UseFormSetValue<NominationFormData>;
  selectedTrade: CheckatradeTradeSearchResult | null;
  setSelectedTrade: (trade: CheckatradeTradeSearchResult | null) => void;
  tradeProfile: CheckatradeTradeProfile | null;
  loadingProfile: boolean;
  handleTradeSelect: (trade: CheckatradeTradeSearchResult) => void;
  nextStep: () => void;
}

export default function Step1Nominee({
  register,
  control,
  watch,
  errors,
  selectedTrade,
  setSelectedTrade,
  tradeProfile,
  loadingProfile,
  handleTradeSelect,
  nextStep
}: Step1Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Step 1: Who are you nominating?</h2>
      
      <div className="space-y-4">
        <Controller
          name="nominee"
          control={control}
          render={() => (
            <TradeSearch 
              onSelect={handleTradeSelect} 
            />
          )}
        />
        
        {selectedTrade ? (
          <TradeProfileCard
            selectedTrade={selectedTrade}
            tradeProfile={tradeProfile}
            loadingProfile={loadingProfile}
            setSelectedTrade={setSelectedTrade}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
                <span className="text-red-600 ml-1">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register('nominee.companyName', { required: "Company name is required" })}
              />
              {errors.nominee?.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.nominee.companyName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700">
                Trade Type
                <span className="text-red-600 ml-1">*</span>
              </label>
              <input
                type="text"
                id="tradeName"
                placeholder="e.g., Plumber, Electrician, Carpenter"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register('nominee.tradeName', { required: "Trade type is required" })}
              />
              {errors.nominee?.tradeName && (
                <p className="mt-1 text-sm text-red-600">{errors.nominee.tradeName.message}</p>
              )}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500 mt-2">
            Note: If your nominee is not a Checkatrade member, their nomination will still be considered but will require additional verification.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          disabled={!selectedTrade && (!watch('nominee.companyName') || !watch('nominee.tradeName'))}
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
