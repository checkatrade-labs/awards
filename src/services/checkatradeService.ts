import axios from 'axios';
import { CheckatradeTradeSearchResult, CheckatradeTradeProfile } from '@/types/nomination';

const CHECKATRADE_API_BASE_URL = 'https://api.checkatrade.com/v1/consumer-public';

// Define interfaces for API responses
interface CheckatradeTradeResponse {
  companyId: string;
  name: string;
  location: string;
  skills?: string[];
  logoUrl?: string;
}

interface CheckatradeTradeProfileResponse {
  companyId: string;
  name: string;
  uniqueName: string;
  location: string;
  traits?: {
    companyType?: string;
    owner?: string;
  };
  skills?: Array<{ label: string }>;
  categories?: Array<{ label: string }>;
  description?: string;
  reviewsSummary?: {
    recentMeanScore?: number;
  };
}

/**
 * Service for interacting with the Checkatrade API
 */
export const checkatradeService = {
  /**
   * Search for trades by name for autocomplete
   * @param searchTerm - The search term to find trades
   * @param page - Page number for pagination (default: 1)
   * @param size - Number of results per page (default: 10)
   * @returns Array of trade results and pagination info
   */
  async searchTrades(
    searchTerm: string,
    page: number = 1,
    size: number = 10
  ): Promise<{
    options: CheckatradeTradeSearchResult[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await axios.get(`${CHECKATRADE_API_BASE_URL}/trades`, {
        params: {
          name: searchTerm,
          page,
          size,
        },
      });

      // Transform the response for autocomplete dropdown
      const options = response.data.data.map((trade: CheckatradeTradeResponse) => ({
        companyId: trade.companyId,
        name: trade.name,
        location: trade.location,
        skills: trade.skills || [],
        logoUrl: trade.logoUrl,
      }));

      return {
        options,
        hasMore: response.data.page * response.data.size < response.data.total,
        total: response.data.total,
      };
    } catch (error) {
      console.error('Error searching trades:', error);
      return { options: [], hasMore: false, total: 0 };
    }
  },

  /**
   * Get a trade profile by company ID
   * @param companyId - The Checkatrade company ID
   * @returns Trade profile information including validation status
   */
  async getTradeProfile(companyId: string): Promise<CheckatradeTradeProfile> {
    try {
      const response = await axios.get(
        `${CHECKATRADE_API_BASE_URL}/trades/${companyId}`
      );

      // Extract relevant information for the nomination
      const {
        companyId: id,
        name,
        uniqueName,
        location,
        traits,
        skills,
        categories,
        description,
        reviewsSummary,
      } = response.data as CheckatradeTradeProfileResponse;

      return {
        companyId: id,
        name,
        uniqueName,
        location,
        isValidMember: true, // If we can fetch the profile, they're a member
        companyType: traits?.companyType,
        owner: traits?.owner,
        skills: skills?.map((s) => s.label) || [],
        categories: categories?.map((c) => c.label) || [],
        description,
        rating: reviewsSummary?.recentMeanScore,
      };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        // Trade not found - not a Checkatrade member
        return {
          companyId: '',
          name: '',
          uniqueName: '',
          location: '',
          isValidMember: false,
          skills: [],
          categories: [],
        };
      }
      console.error('Error fetching trade profile:', error);
      throw error;
    }
  },
};
