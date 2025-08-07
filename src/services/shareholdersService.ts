import {
  ShareholdersApiResponse,
  ShareholderDetailsApiResponse,
  ShareholdersData,
  ShareholderDetail,
  OwnershipBreakdown,
  PieChartData
} from '@/types/shareholders';

const API_BASE_URL = 'https://api2.simplize.vn/api/company/ownership';

export class ShareholdersService {
  /**
   * Fetch ownership breakdown data
   */
  static async getOwnershipBreakdown(ticker: string): Promise<ShareholdersApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ownership-breakdown/${ticker}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 200) {
        throw new Error(`API error: ${data.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching ownership breakdown:', error);
      throw error;
    }
  }

  /**
   * Fetch shareholder details and fund holdings
   */
  static async getShareholderDetails(ticker: string): Promise<ShareholderDetailsApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/shareholder-fund-details/${ticker}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 200) {
        throw new Error(`API error: ${data.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching shareholder details:', error);
      throw error;
    }
  }

  /**
   * Fetch all shareholders data
   */
  static async getAllShareholdersData(ticker: string): Promise<ShareholdersData> {
    try {
      // Fetch both APIs in parallel for better performance
      const [ownershipResponse, shareholderResponse] = await Promise.all([
        this.getOwnershipBreakdown(ticker),
        this.getShareholderDetails(ticker)
      ]);

      return {
        ownershipBreakdown: ownershipResponse.data || [],
        shareholderDetails: shareholderResponse.data?.shareholderDetails || [],
        fundHoldings: shareholderResponse.data?.fundHoldings || []
      };
    } catch (error) {
      console.error('Error fetching all shareholders data:', error);
      throw error;
    }
  }

  /**
   * Transform ownership breakdown data for pie chart
   */
  static transformToPieChartData(ownershipBreakdown: OwnershipBreakdown[]): PieChartData[] {
    const colors = [
      '#0088FE', // Blue
      '#00C49F', // Green
      '#FFBB28', // Yellow
      '#FF8042', // Orange
      '#8884D8', // Purple
      '#82CA9D', // Light Green
      '#FFC658', // Light Orange
      '#FF7C7C', // Light Red
      '#8DD1E1', // Light Blue
      '#D084D0'  // Light Purple
    ];

    return ownershipBreakdown.map((item, index) => ({
      name: item.investorType,
      value: item.pctOfSharesOutHeldTier,
      color: colors[index % colors.length]
    }));
  }

  /**
   * Get top shareholders by percentage
   */
  static getTopShareholders(shareholderDetails: ShareholderDetail[], limit: number = 10) {
    return shareholderDetails
      .sort((a, b) => b.pctOfSharesOutHeld - a.pctOfSharesOutHeld)
      .slice(0, limit);
  }

  /**
   * Group shareholders by country
   */
  static groupShareholdersByCountry(shareholderDetails: ShareholderDetail[]) {
    const grouped = shareholderDetails.reduce((acc, shareholder) => {
      const country = shareholder.countryOfInvestor;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(shareholder);
      return acc;
    }, {} as Record<string, ShareholderDetail[]>);

    // Sort countries by total ownership percentage
    return Object.entries(grouped)
      .map(([country, shareholders]) => ({
        country,
        shareholders,
        totalPercentage: shareholders.reduce((sum, s) => sum + s.pctOfSharesOutHeld, 0),
        totalValue: shareholders.reduce((sum, s) => sum + s.currentValue, 0)
      }))
      .sort((a, b) => b.totalPercentage - a.totalPercentage);
  }

  /**
   * Calculate ownership statistics
   */
  static calculateOwnershipStats(shareholderDetails: ShareholderDetail[]) {
    const totalShareholders = shareholderDetails.length;
    const totalPercentage = shareholderDetails.reduce((sum, s) => sum + s.pctOfSharesOutHeld, 0);
    const totalValue = shareholderDetails.reduce((sum, s) => sum + s.currentValue, 0);
    const totalShares = shareholderDetails.reduce((sum, s) => sum + s.sharesHeld, 0);
    
    const positiveChanges = shareholderDetails.filter(s => s.changeValue > 0).length;
    const negativeChanges = shareholderDetails.filter(s => s.changeValue < 0).length;
    const noChanges = shareholderDetails.filter(s => s.changeValue === 0).length;

    return {
      totalShareholders,
      totalPercentage,
      totalValue,
      totalShares,
      positiveChanges,
      negativeChanges,
      noChanges
    };
  }
}
