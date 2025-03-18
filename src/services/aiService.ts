import OpenAI from 'openai';
import { JustificationFeedback, NominationScore } from '@/types/nomination';
import { mockJustificationFeedback, mockNominationScore } from './aiServiceMocks';

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const IS_API_KEY_AVAILABLE = !!OPENAI_API_KEY;

// Initialize OpenAI client if API key is available
const openai = IS_API_KEY_AVAILABLE 
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

/**
 * Service for AI-based text analysis using OpenAI
 */
export const aiService = {
  /**
   * Provide real-time feedback on nomination justification text
   * @param text - The justification text to analyze
   * @returns Feedback object with quality assessment, suggestions, and score
   */
  async provideJustificationFeedback(text: string): Promise<JustificationFeedback> {
    // If text is too short, return early with feedback
    if (text.length < 10) {
      return {
        quality: 'too_short',
        feedback: 'Your nomination is too short. Please provide more details about why this trade deserves recognition.',
        score: 0
      };
    }

    try {
      // If no API key, return mock response
      if (!IS_API_KEY_AVAILABLE) {
        console.log('Using mock AI feedback (no OpenAI API key available)');
        return mockJustificationFeedback(text);
      }
      
      const response = await openai!.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that evaluates award nominations based on quality, sentiment, and alignment with judging criteria (trust, quality, reliability). Provide constructive feedback to help improve the nomination.

            Respond with a JSON object in the following format:
            {
              "quality_score": number from 1-10,
              "feedback": "constructive feedback for improvement",
              "suggestions": ["suggestion 1", "suggestion 2", ...],
              "criteria_alignment": {
                "trust": number from 1-10,
                "quality": number from 1-10,
                "reliability": number from 1-10
              }
            }`
          },
          {
            role: 'user',
            content: `Please analyze this nomination text and provide feedback to help improve it. Focus on judging criteria of trust, quality, and reliability.
            
            Text: """${text}"""`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = response.choices[0].message.content;
      if (!result) {
        throw new Error('No content returned from OpenAI');
      }
      
      // Parse the JSON response
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      
      return {
        quality: parsedResult.quality_score > 7 ? 'good' : parsedResult.quality_score > 4 ? 'average' : 'needs_improvement',
        feedback: parsedResult.feedback,
        suggestions: parsedResult.suggestions,
        criteriaAlignment: parsedResult.criteria_alignment,
        score: parsedResult.quality_score
      };
    } catch (error) {
      console.error('Error analyzing nomination:', error);
      
      // Return a fallback response if AI analysis fails
      return {
        quality: 'error',
        feedback: 'We could not analyze your nomination at this time. Please continue with your submission.',
        score: undefined
      };
    }
  },

  /**
   * Score a nomination for admin review
   * @param nomination - The nomination data including category, relationship, and justification
   * @returns Detailed scoring and analysis
   */
  async scoreNomination(nomination: {
    category: string;
    relationship: string;
    justification: string;
  }): Promise<NominationScore> {
    try {
      // If no API key, return mock response
      if (!IS_API_KEY_AVAILABLE) {
        console.log('Using mock nomination scoring (no OpenAI API key available)');
        return mockNominationScore();
      }
      
      const response = await openai!.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that evaluates award nominations for the Checkatrade Awards.
            Score nominations based on the following criteria:
            - Trust: Evidence that the trade is trustworthy and reliable
            - Quality: Evidence of high-quality workmanship
            - Reliability: Evidence that the trade delivers on promises and deadlines
            - Specificity: Concrete examples rather than generic praise
            - Enthusiasm: Level of passion and conviction in the nomination
            
            Last year, nominations like "He's amazing" without substantive content were considered low quality.
            
            Respond with a JSON object in the following format:
            {
              "overall_score": number from 1-100,
              "criteria": {
                "trust": number from 1-10,
                "quality": number from 1-10,
                "reliability": number from 1-10,
                "specificity": number from 1-10,
                "enthusiasm": number from 1-10
              },
              "key_strengths": ["strength 1", "strength 2", ...],
              "recommend_shortlist": boolean,
              "reasons": ["reason 1", "reason 2", ...]
            }`
          },
          {
            role: 'user',
            content: `Please analyze this nomination:
            
            Nomination category: ${nomination.category}
            Nominator relationship: ${nomination.relationship}
            Nomination text: """${nomination.justification}"""
            `
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const result = response.choices[0].message.content;
      // Parse the JSON response if it's a string, otherwise use it directly
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      
      return {
        overallScore: parsedResult.overall_score,
        criteria: {
          trust: parsedResult.criteria.trust,
          quality: parsedResult.criteria.quality,
          reliability: parsedResult.criteria.reliability,
          specificity: parsedResult.criteria.specificity,
          enthusiasm: parsedResult.criteria.enthusiasm
        },
        strengths: parsedResult.key_strengths,
        recommendShortlist: parsedResult.recommend_shortlist,
        reasons: parsedResult.reasons
      };
    } catch (error) {
      console.error('Error scoring nomination:', error);
      throw error;
    }
  },

  /**
   * Check if nominations are duplicates based on content similarity
   * @param justifications - Array of justification texts to compare
   * @returns Boolean indicating if they are likely duplicates
   */
  async checkDuplicates(justifications: string[]): Promise<boolean> {
    if (justifications.length < 2) return false;

    try {
      // If no API key, return mock response
      if (!IS_API_KEY_AVAILABLE) {
        console.log('Using mock duplicate detection (no OpenAI API key available)');
        return false;
      }
      
      const response = await openai!.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes nomination texts to determine if they are duplicate submissions with minor variations.
            
            Respond with a JSON object in the following format:
            {
              "are_duplicates": boolean,
              "explanation": "brief explanation for the decision"
            }`
          },
          {
            role: 'user',
            content: `Analyze these nomination texts and determine if they are essentially duplicates (same core content with minor variations).
            
            Nominations:
            ${justifications.map((text, i) => `Text ${i+1}: "${text}"`).join('\n')}
            `
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const result = response.choices[0].message.content;
      // Parse the JSON response if it's a string, otherwise use it directly
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      return parsedResult.are_duplicates;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false; // Default to not assuming duplicates if the check fails
    }
  }
};
