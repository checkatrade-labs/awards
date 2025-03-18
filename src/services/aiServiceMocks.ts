import { JustificationFeedback, NominationScore } from '@/types/nomination';

/**
 * Generate mock justification feedback for development when API key is not available
 */
export const mockJustificationFeedback = (text: string): JustificationFeedback => {
  // Simple text length based scoring
  const score = Math.min(Math.floor(text.length / 20), 10);
  
  return {
    quality: score > 7 ? 'good' : score > 4 ? 'average' : 'needs_improvement',
    feedback: 'This is a mock feedback response since no OpenAI API key is available. Add your API key to .env.local to enable real AI feedback.',
    suggestions: [
      'Include specific examples of the trade\'s work',
      'Mention how they demonstrated trustworthiness',
      'Describe the quality of their craftsmanship',
      'Explain how they were reliable and professional'
    ],
    criteriaAlignment: {
      trust: Math.min(Math.floor(text.length / 25), 10),
      quality: Math.min(Math.floor(text.length / 30), 10),
      reliability: Math.min(Math.floor(text.length / 35), 10)
    },
    score: score
  };
};

/**
 * Generate mock nomination score for development when API key is not available
 */
export const mockNominationScore = (): NominationScore => {
  return {
    overallScore: 75,
    criteria: {
      trust: 8,
      quality: 7,
      reliability: 8,
      specificity: 6,
      enthusiasm: 9
    },
    strengths: [
      'Shows enthusiasm for the trade\'s work',
      'Emphasizes trust and reliability',
      'Mentions specific skills'
    ],
    recommendShortlist: true,
    reasons: [
      'Strong overall nomination',
      'Good alignment with judging criteria',
      'Specific examples provided'
    ]
  };
};
