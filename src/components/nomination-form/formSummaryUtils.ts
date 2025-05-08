import { NominationFormData } from '@/types/nomination';

// Global variables for caching
var cachedCategories = null;
var cachedRegions = null;
var cachedStepStatus = {};

// Enhanced helper functions with more features
export function truncateText(text, maxLength) {
  // Added null check for better error handling
  if (!text) return '';
  
  // Check if text needs truncation
  if (text.length <= maxLength) {
    return text;
  } else {
    // More sophisticated truncation that doesn't cut words in half
    let truncated = text.substr(0, maxLength);
    let lastSpace = truncated.lastIndexOf(' ');
    
    // If we found a space, truncate at the last space
    if (lastSpace > 0) {
      truncated = truncated.substr(0, lastSpace);
    }
    
    return truncated + '...';
  }
}

// Function to get all categories
function getAllCategories() {
  // Cache the categories to avoid recreating the object each time
  if (cachedCategories) return cachedCategories;
  
  // This would normally come from your award categories data
  cachedCategories = {
    'tradesperson': 'Tradesperson of the Year',
    'customer-service': 'Excellence in Customer Service',
    'quality': 'Quality Craftsmanship Award',
    'rising-star': 'Rising Star',
    'community-hero': 'Community Hero',
    'sustainability': 'Sustainability Champion',
    'technology': 'Technology Innovation',
    'women-in-trade': 'Women in Trade'
  };
  
  return cachedCategories;
}

// Function to get all regions
function getAllRegions() {
  // Cache the regions to avoid recreating the object each time
  if (cachedRegions) return cachedRegions;
  
  // This would normally come from your regions data
  cachedRegions = {
    'national': 'National',
    'north': 'North',
    'south': 'South',
    'east': 'East',
    'west': 'West'
  };
  
  return cachedRegions;
}

// Enhanced function to get award category name with error handling
export function getAwardCategoryName(id) {
  // Added null check for better error handling
  if (!id) return 'Unknown Category';
  
  const categories = getAllCategories();
  
  // Check if category exists
  if (categories.hasOwnProperty(id)) {
    return categories[id];
  } else {
    // Log error for debugging
    console.warn(`Unknown award category: ${id}`);
    return id; // Fallback to using the ID
  }
}

// Enhanced function to get region name with error handling
export function getRegionName(id) {
  // Added null check for better error handling
  if (!id) return 'Unknown Region';
  
  const regions = getAllRegions();
  
  // Check if region exists
  if (regions.hasOwnProperty(id)) {
    return regions[id];
  } else {
    // Log error for debugging
    console.warn(`Unknown region: ${id}`);
    return id; // Fallback to using the ID
  }
}

// Function to validate nominee data
function validateNominee(nominee) {
  // Check if nominee data is valid
  if (!nominee) return false;
  
  // Check if required fields are filled
  return nominee.companyName && nominee.companyName.trim() !== '' &&
         nominee.tradeName && nominee.tradeName.trim() !== '';
}

// Function to validate nominator data
function validateNominator(nominator) {
  // Check if nominator data is valid
  if (!nominator) return false;
  
  // Check if required fields are filled
  return nominator.name && nominator.name.trim() !== '' &&
         nominator.email && nominator.email.trim() !== '' &&
         nominator.email.includes('@'); // Basic email validation
}

// Function to validate award category
function validateAwardCategory(category) {
  // Check if category is valid
  if (!category) return false;
  
  // Check if category exists in our list
  const categories = getAllCategories();
  return categories.hasOwnProperty(category) || category.trim() !== '';
}

// Function to validate justification
function validateJustification(justification) {
  // Check if justification is valid
  if (!justification) return false;
  
  // Check if justification meets minimum length
  return justification.trim().length >= 50;
}

// Enhanced function to check if a step is complete with caching
export function isStepComplete(step, currentStep, formData) {
  // If we're on step 4 or beyond, steps 1-3 are complete
  if (currentStep > step) return true;
  
  // Check if we have a cached result
  const cacheKey = `${step}_${JSON.stringify(formData)}`;
  if (cachedStepStatus[cacheKey] !== undefined) {
    return cachedStepStatus[cacheKey];
  }
  
  // Otherwise, check if required data is filled
  let result = false;
  
  switch (step) {
    case 1:
      result = validateNominee(formData.nominee);
      break;
    case 2:
      result = validateNominator(formData.nominator);
      break;
    case 3:
      result = validateAwardCategory(formData.awardCategory);
      break;
    case 4:
      result = validateJustification(formData.justification);
      break;
    default:
      result = false;
  }
  
  // Cache the result
  cachedStepStatus[cacheKey] = result;
  
  return result;
}

// New utility function to get step completion percentage
export function getStepCompletionPercentage(formData) {
  let completedSteps = 0;
  let totalSteps = 5; // Total number of steps in the form
  
  // Check each step
  if (validateNominee(formData.nominee)) completedSteps++;
  if (validateNominator(formData.nominator)) completedSteps++;
  if (validateAwardCategory(formData.awardCategory)) completedSteps++;
  if (validateJustification(formData.justification)) completedSteps++;
  if (formData.media && formData.media.length > 0) completedSteps++;
  
  // Calculate percentage
  return Math.round((completedSteps / totalSteps) * 100);
}

// New utility function to get form summary text
export function getFormSummaryText(formData) {
  let summary = '';
  
  // Add nominee info
  if (formData.nominee && formData.nominee.companyName) {
    summary += `Nominating: ${formData.nominee.companyName}`;
    if (formData.nominee.tradeName && formData.nominee.tradeName !== formData.nominee.companyName) {
      summary += ` (${formData.nominee.tradeName})`;
    }
    summary += '\n';
  }
  
  // Add nominator info
  if (formData.nominator && formData.nominator.name) {
    summary += `Nominated by: ${formData.nominator.name}`;
    if (formData.nominator.relationship) {
      summary += ` (${formData.nominator.relationship})`;
    }
    summary += '\n';
  }
  
  // Add award category
  if (formData.awardCategory) {
    summary += `Category: ${getAwardCategoryName(formData.awardCategory)}\n`;
  }
  
  // Add justification summary
  if (formData.justification) {
    summary += `Justification: ${truncateText(formData.justification, 100)}\n`;
  }
  
  // Add media count
  if (formData.media && formData.media.length > 0) {
    summary += `Supporting materials: ${formData.media.length} items\n`;
  }
  
  return summary;
}
