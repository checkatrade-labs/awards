export type NominationStatus = 'pending' | 'shortlisted' | 'rejected';

export type NominationRelationship = 'customer' | 'colleague' | 'friend' | 'family' | 'self';

export type MediaType = 'image' | 'document';

export interface Nominee {
  id?: string;
  companyId?: string;
  companyName: string;
  tradeName: string;
  tradeType?: string;
  contactEmail?: string;
  contactPhone?: string;
  isValidMember: boolean;
  needsReview: boolean;
  location?: string;
}

export interface Nominator {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  relationship: NominationRelationship;
}

export interface Justification {
  id?: string;
  text: string;
  sentimentScore?: number;
  criteriaAlignment?: number;
  feedback?: string;
  qualityAssessment?: string;
}

export interface Media {
  id?: string;
  url: string;
  type: MediaType;
  description?: string;
  storagePath: string;
}

export interface AwardCategory {
  id: string;
  name: string;
  description?: string;
  allowsSelfNomination: boolean;
  region?: string;
}

export interface Nomination {
  id?: string;
  awardCategory: string;
  region?: string;
  status: NominationStatus;
  qualityScore?: number;
  nominationCount: number;
  isShortlisted: boolean;
  manualOverride: boolean;
  nominee: Nominee;
  nominator: Nominator;
  justifications: Justification[];
  media: Media[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Form specific types
export interface NominationFormData {
  nominee: {
    companyId?: string;
    companyName: string;
    tradeName: string;
    location?: string;
  };
  nominator: {
    name: string;
    email: string;
    phone?: string;
    relationship: NominationRelationship;
  };
  awardCategory: string;
  region?: string;
  justification: string;
  media?: File[];
  additionalDetails?: string;
}

// Checkatrade API types
export interface CheckatradeTradeSearchResult {
  companyId: string;
  name: string;
  location: string;
  skills: string[];
  logoUrl?: string;
}

export interface CheckatradeTradeProfile {
  companyId: string;
  name: string;
  uniqueName: string;
  location: string;
  isValidMember: boolean;
  companyType?: string;
  owner?: string;
  skills: string[];
  categories: string[];
  description?: string;
  rating?: number;
}

// AI feedback types
export interface JustificationFeedback {
  quality: 'good' | 'average' | 'needs_improvement' | 'too_short' | 'error';
  feedback: string;
  suggestions?: string[];
  criteriaAlignment?: {
    trust: number;
    quality: number;
    reliability: number;
  };
  score?: number;
}

export interface NominationScore {
  overallScore: number;
  criteria: {
    trust: number;
    quality: number;
    reliability: number;
    specificity: number;
    enthusiasm: number;
  };
  strengths: string[];
  recommendShortlist: boolean;
  reasons: string[];
}
