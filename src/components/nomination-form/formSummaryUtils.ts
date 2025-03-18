import { NominationFormData } from '@/types/nomination';

// Helper functions
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getAwardCategoryName = (id: string): string => {
  // This would normally come from your award categories data
  const categories: Record<string, string> = {
    'tradesperson': 'Tradesperson of the Year',
    'customer-service': 'Excellence in Customer Service',
    'quality': 'Quality Craftsmanship Award',
    'rising-star': 'Rising Star',
    'community-hero': 'Community Hero',
    'sustainability': 'Sustainability Champion',
    'technology': 'Technology Innovation',
    'women-in-trade': 'Women in Trade'
  };
  return categories[id] || id;
};

export const getRegionName = (id: string): string => {
  // This would normally come from your regions data
  const regions: Record<string, string> = {
    'national': 'National',
    'north': 'North',
    'south': 'South',
    'east': 'East',
    'west': 'West'
  };
  return regions[id] || id;
};

// Check if a step has been completed
export const isStepComplete = (step: number, currentStep: number, formData: NominationFormData): boolean => {
  // If we're on step 4 or beyond, steps 1-3 are complete
  if (currentStep > step) return true;
  
  // Otherwise, check if required data is filled
  switch (step) {
    case 1:
      return !!(formData.nominee.companyName && formData.nominee.tradeName);
    case 2:
      return !!(formData.nominator.name && formData.nominator.email);
    case 3:
      return !!formData.awardCategory;
    case 4:
      return !!formData.justification && formData.justification.length >= 50;
    default:
      return false;
  }
};
