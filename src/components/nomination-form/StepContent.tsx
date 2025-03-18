'use client';

import { NominationFormData } from '@/types/nomination';
import { truncateText, getAwardCategoryName, getRegionName } from './formSummaryUtils';

interface StepContentProps {
  step: number;
  formData: NominationFormData;
}

export default function StepContent({ step, formData }: StepContentProps) {
  switch (step) {
    case 1:
      return (
        <div>
          {formData.nominee.companyName && (
            <p className="text-sm text-gray-600 truncate">
              {formData.nominee.companyName}
            </p>
          )}
          {formData.nominee.tradeName && (
            <p className="text-xs text-gray-500 truncate">
              {formData.nominee.tradeName}
            </p>
          )}
        </div>
      );
    case 2:
      return (
        <div>
          {formData.nominator.name && (
            <p className="text-sm text-gray-600 truncate">
              {formData.nominator.name}
            </p>
          )}
          {formData.nominator.email && (
            <p className="text-xs text-gray-500 truncate">
              {formData.nominator.email}
            </p>
          )}
          {formData.nominator.relationship && (
            <p className="text-xs text-gray-500">
              {formData.nominator.relationship === 'self' ? 'Self-nomination' : `As: ${formData.nominator.relationship}`}
            </p>
          )}
        </div>
      );
    case 3:
      return (
        <div>
          {formData.awardCategory && (
            <p className="text-sm text-gray-600">
              {getAwardCategoryName(formData.awardCategory)}
            </p>
          )}
          {formData.region && (
            <p className="text-xs text-gray-500">
              Region: {getRegionName(formData.region)}
            </p>
          )}
        </div>
      );
    case 4:
      return (
        <div>
          {formData.justification && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {truncateText(formData.justification, 60)}
            </p>
          )}
        </div>
      );
    case 5:
      return (
        <div>
          {formData.media && formData.media.length > 0 ? (
            <p className="text-sm text-gray-600">
              {formData.media.length} {formData.media.length === 1 ? 'image' : 'images'} attached
            </p>
          ) : (
            <p className="text-sm text-gray-500">No images attached</p>
          )}
          {formData.additionalDetails && (
            <p className="text-xs text-gray-500">Additional details provided</p>
          )}
        </div>
      );
    default:
      return null;
  }
}
