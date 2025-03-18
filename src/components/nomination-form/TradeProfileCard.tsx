'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { CheckatradeTradeSearchResult, CheckatradeTradeProfile } from '@/types/nomination';

// Helper function to strip HTML tags from text
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

// Helper function to render star rating
const renderStarRating = (rating: number) => {
  const stars = Math.round(rating / 2);
  return (
    <span className="text-amber-500 flex">
      {Array(stars).fill(0).map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
};

interface TradeProfileCardProps {
  selectedTrade: CheckatradeTradeSearchResult; 
  tradeProfile: CheckatradeTradeProfile | null; 
  loadingProfile: boolean;
  setSelectedTrade: (trade: CheckatradeTradeSearchResult | null) => void;
}

export default function TradeProfileCard({ 
  selectedTrade, 
  tradeProfile, 
  loadingProfile, 
  setSelectedTrade 
}: TradeProfileCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header with accent color */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-blue-800">Selected Trade Profile</h3>
        <button 
          onClick={() => setSelectedTrade(null)}
          className="text-sm text-blue-700 hover:text-blue-900 flex items-center bg-white px-2 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition"
          aria-label="Change selection"
        >
          Change selection
        </button>
      </div>
      
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          {selectedTrade.logoUrl ? (
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image 
                src={selectedTrade.logoUrl} 
                alt={`${selectedTrade.name} logo`}
                width={80}
                height={80}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                className="rounded-md border border-gray-200 bg-white p-1"
                onError={() => {
                  // We'll handle errors with the fallback div
                  return false;
                }}
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-gray-500 text-xs font-medium">No Logo</span>
            </div>
          )}
          
          {/* Basic info */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{selectedTrade.name}</h4>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {selectedTrade.location}
            </p>
            
            {loadingProfile && (
              <div className="flex items-center mt-3">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <p className="text-sm text-blue-600">Loading additional information...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Profile details */}
        {!loadingProfile && tradeProfile && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
            {/* Basic company info */}
            <div className="flex flex-wrap gap-4">
              {tradeProfile.companyType && (
                <div className="flex-grow">
                  <h5 className="text-sm font-medium text-gray-700">Company Type</h5>
                  <p className="text-sm text-gray-600">
                    {tradeProfile.companyType}
                    {tradeProfile.owner && <span className="text-gray-500 ml-1">({tradeProfile.owner})</span>}
                  </p>
                </div>
              )}
              
              {tradeProfile.rating && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Rating</h5>
                  <div className="flex items-center">
                    {renderStarRating(tradeProfile.rating)}
                    <span className="ml-1 text-sm text-gray-700">
                      {tradeProfile.rating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Categories */}
            {tradeProfile.categories?.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Categories</h5>
                <div className="flex flex-wrap gap-2">
                  {tradeProfile.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills */}
            {tradeProfile.skills?.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {tradeProfile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            {tradeProfile.description && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {stripHtml(tradeProfile.description)}
                </p>
              </div>
            )}
            
            {/* Checkatrade link */}
            {tradeProfile.uniqueName && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <a 
                  href={`https://www.checkatrade.com/trades/${tradeProfile.uniqueName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View full profile on Checkatrade
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}
        
        {/* Show skills from search result if profile not loaded yet */}
        {!loadingProfile && !tradeProfile && selectedTrade.skills?.length > 0 && (
          <div className="mt-3">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Skills</h5>
            <div className="flex flex-wrap gap-2">
              {selectedTrade.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
