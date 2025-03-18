'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  NominationFormData, 
  CheckatradeTradeSearchResult,
  CheckatradeTradeProfile
} from '@/types/nomination';
import { checkatradeService } from '@/services/checkatradeService';
import FormSummary from './FormSummary';
import Step1Nominee from './steps/Step1Nominee';
import Step2Nominator from './steps/Step2Nominator';
import Step3Category from './steps/Step3Category';
import Step4Justification from './steps/Step4Justification';
import Step5Supporting from './steps/Step5Supporting';


export default function NominationForm() {
  // Form state using React Hook Form
  const { 
    control, 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<NominationFormData>({
    defaultValues: {
      nominee: {
        companyName: '',
        tradeName: '',
      },
      nominator: {
        name: '',
        email: '',
        relationship: 'customer',
      },
      awardCategory: '',
      justification: '',
      media: [],
    }
  });

  // Component state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<CheckatradeTradeSearchResult | null>(null);
  const [tradeProfile, setTradeProfile] = useState<CheckatradeTradeProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleTradeSelect = async (trade: CheckatradeTradeSearchResult) => {
    setSelectedTrade(trade);
    setValue('nominee.companyId', trade.companyId);
    setValue('nominee.companyName', trade.name);
    setValue('nominee.tradeName', trade.name);
    setValue('nominee.location', trade.location);
    
    // Fetch additional trade profile information
    setLoadingProfile(true);
    try {
      const profile = await checkatradeService.getTradeProfile(trade.companyId);
      setTradeProfile(profile);
    } catch (error) {
      console.error('Error fetching trade profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleJustificationQualityCheck = (isHighQuality: boolean) => {
    // This could be used to provide feedback to the user or influence the form flow
    console.log('Justification quality check:', isHighQuality);
  };

  const nextStep = () => {
    setCurrentStep(current => current + 1);
  };

  const prevStep = () => {
    setCurrentStep(current => current - 1);
  };

  const onSubmit = async (data: NominationFormData) => {
    try {
      // In a real implementation, we would call an API endpoint here
      console.log('Submitting nomination:', data);
      
      // Mock success message - would be replaced with actual API call
      alert('Nomination submitted successfully!');
    } catch (error) {
      console.error('Error submitting nomination:', error);
    }
  };

  // Direct navigation to a specific step from summary panel
  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Summary sidebar - hidden on small screens, shown on large screens */}
        <div className="hidden lg:block lg:w-1/4">
          <FormSummary 
            currentStep={currentStep} 
            formData={watch()} 
            onNavigate={navigateToStep}
            isExpanded={true}
          />
        </div>
        
        {/* Main form content */}
        <div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
          {/* Mobile summary - shown on small screens, hidden on large screens */}
          <div className="mb-6 lg:hidden">
            <FormSummary 
              currentStep={currentStep} 
              formData={watch()} 
              onNavigate={navigateToStep}
              isExpanded={false}
            />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Nominee Selection */}
            {currentStep === 1 && (
              <Step1Nominee
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                setValue={setValue}
                selectedTrade={selectedTrade}
                setSelectedTrade={setSelectedTrade}
                tradeProfile={tradeProfile}
                loadingProfile={loadingProfile}
                handleTradeSelect={handleTradeSelect}
                nextStep={nextStep}
              />
            )}
            
            {/* Step 2: Your Information */}
            {currentStep === 2 && (
              <Step2Nominator
                register={register}
                watch={watch}
                errors={errors}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            
            {/* Step 3: Award Category */}
            {currentStep === 3 && (
              <Step3Category
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            
            {/* Step 4: Justification */}
            {currentStep === 4 && (
              <Step4Justification
                control={control}
                watch={watch}
                errors={errors}
                handleJustificationQualityCheck={handleJustificationQualityCheck}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            
            {/* Step 5: Supporting Materials */}
            {currentStep === 5 && (
              <Step5Supporting
                control={control}
                isSubmitting={isSubmitting}
                prevStep={prevStep}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
