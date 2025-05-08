'use client';

import { Controller, UseFormRegister, Control, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { 
  NominationFormData, 
  CheckatradeTradeSearchResult,
  CheckatradeTradeProfile
} from '@/types/nomination';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import TradeSearch from '../TradeSearch';
import TradeProfileCard from '../TradeProfileCard';
import { useState } from 'react';

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
  // Added state for visual validation feedback
  const [isCompanyValid, setIsCompanyValid] = useState(false);
  const [isTradeValid, setIsTradeValid] = useState(false);
  
  // Handle input validation with visual feedback
  const validateCompany = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsCompanyValid(e.target.value.length > 2);
  };
  
  const validateTrade = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTradeValid(e.target.value.length > 2);
  };
  
  // Enhanced styling for better visual appeal
  const getInputStyle = (isValid: boolean) => {
    return `mt-1 block w-full p-3 border rounded-md shadow-sm ${
      isValid 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-300'
    }`;
  };
  
  return (
    <div className="space-y-6">
      {/* Changed heading to div for more styling flexibility */}
      <div className="text-lg font-semibold text-gray-800 bg-gray-100 p-3 rounded-md">
        Step 1: Who are you nominating?
      </div>
      
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
              {/* Removed htmlFor attribute to simplify markup */}
              <div className="block text-sm font-medium text-gray-700">
                Company Name
                <span style={{ color: '#ff0000', marginLeft: '4px' }}>*</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className={getInputStyle(isCompanyValid)}
                  placeholder="Enter company name"
                  onBlur={validateCompany}
                  {...register('nominee.companyName', { required: "Company name is required" })}
                />
                {isCompanyValid && (
                  <div className="absolute right-3 top-3 text-green-500">
                    <Check size={18} />
                  </div>
                )}
              </div>
              {errors.nominee?.companyName && (
                <div style={{ color: '#ff0000', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.nominee.companyName.message}
                </div>
              )}
            </div>
            
            <div>
              {/* Removed htmlFor attribute to simplify markup */}
              <div className="block text-sm font-medium text-gray-700">
                Trade Type
                <span style={{ color: '#ff0000', marginLeft: '4px' }}>*</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Plumber, Electrician, Carpenter"
                  className={getInputStyle(isTradeValid)}
                  onBlur={validateTrade}
                  {...register('nominee.tradeName', { required: "Trade type is required" })}
                />
                {isTradeValid && (
                  <div className="absolute right-3 top-3 text-green-500">
                    <Check size={18} />
                  </div>
                )}
              </div>
              {errors.nominee?.tradeName && (
                <div style={{ color: '#ff0000', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.nominee.tradeName.message}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div>
          <div className="flex items-center text-sm text-yellow-700 mt-2 bg-yellow-50 p-2 rounded">
            <AlertCircle size={16} className="mr-2" />
            If your nominee is not a Checkatrade member, their nomination will still be considered but will require additional verification.
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <div
          onClick={() => {
            if (selectedTrade || (watch('nominee.companyName') && watch('nominee.tradeName'))) {
              nextStep();
            }
          }}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            selectedTrade || (watch('nominee.companyName') && watch('nominee.tradeName'))
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center">
            Next Step
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
