import { NewsResponse, NewsApiParams, NewsDetail, NewsSentiment } from '@/types/news';

/**
 * Service for fetching news data from Vietcap API
 */
export class NewsService {
  private static readonly BASE_URL = 'https://ai.vietcap.com.vn/api/v2';
  private static readonly API_URL = 'https://ai.vietcap.com.vn/api';

  /**
   * Fetch news information for a specific ticker
   */
  static async getNewsInfo(params: NewsApiParams): Promise<NewsResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      // Add required parameters
      searchParams.append('page', (params.page || 1).toString());
      searchParams.append('ticker', params.ticker);
      searchParams.append('page_size', (params.page_size || 12).toString());
      
      // Add optional parameters
      if (params.industry) searchParams.append('industry', params.industry);
      if (params.update_from) searchParams.append('update_from', params.update_from);
      if (params.update_to) searchParams.append('update_to', params.update_to);
      if (params.sentiment) searchParams.append('sentiment', params.sentiment);
      if (params.newsfrom) searchParams.append('newsfrom', params.newsfrom);
      if (params.language) searchParams.append('language', params.language);

      const url = `${this.BASE_URL}/news_info?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for better performance
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news info:', error);
      throw new Error('Failed to fetch news information');
    }
  }

  /**
   * Get news with default date range (last 30 days)
   */
  static async getRecentNews(ticker: string, sentiment?: string, page: number = 1, pageSize: number = 12): Promise<NewsResponse> {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const params: NewsApiParams = {
      page,
      ticker,
      update_from: thirtyDaysAgo.toISOString().split('T')[0],
      update_to: today.toISOString().split('T')[0],
      sentiment: sentiment as NewsSentiment,
      language: 'vi',
      page_size: pageSize,
    };

    return this.getNewsInfo(params);
  }

  /**
   * Get news count for different sentiments
   */
  static async getNewsSentimentCounts(
    ticker: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  }> {
    try {
      // Use provided dates or default to last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const updateFrom = dateFrom || thirtyDaysAgo.toISOString().split('T')[0];
      const updateTo = dateTo || today.toISOString().split('T')[0];

      const baseParams = {
        ticker,
        update_from: updateFrom,
        update_to: updateTo,
        language: 'vi',
        page_size: 1,
        page: 1,
      };

      // Fetch counts for each sentiment
      const [totalResponse, positiveResponse, negativeResponse] = await Promise.all([
        this.getNewsInfo(baseParams),
        this.getNewsInfo({ ...baseParams, sentiment: 'Positive' }),
        this.getNewsInfo({ ...baseParams, sentiment: 'Negative' }),
      ]);

      const total = totalResponse.total_records;
      const positive = positiveResponse.total_records;
      const negative = negativeResponse.total_records;
      const neutral = total - positive - negative;

      return {
        total,
        positive,
        negative,
        neutral,
      };
    } catch (error) {
      console.error('Error fetching sentiment counts:', error);
      return {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
      };
    }
  }

  /**
   * Get news detail by slug
   */
  static async getNewsDetail(slug: string, language: string = 'vi'): Promise<NewsDetail> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('slug', slug);
      searchParams.append('language', language);

      const url = `${this.API_URL}/news_from_slug?${searchParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for better performance
        next: { revalidate: 600 }, // Cache for 10 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsDetail = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news detail:', error);
      throw new Error('Failed to fetch news detail');
    }
  }
}
