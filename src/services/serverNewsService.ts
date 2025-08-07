import { NewsResponse, NewsApiParams, NewsDetail, NewsSentiment } from '@/types/news';
import { BaseApiService, ApiServiceError } from './baseApiService';
import { Metadata } from 'next';

/**
 * Server-side News API service for data fetching in async components
 * This service is designed to work in server components with proper error handling and caching
 */
export class ServerNewsService extends BaseApiService {
  private static readonly BASE_URL = 'https://ai.vietcap.com.vn/api/v2';
  private static readonly API_URL = 'https://ai.vietcap.com.vn/api';

  /**
   * Fetch news information for a specific ticker (server-side)
   * @param params - News API parameters
   * @returns Promise<NewsResponse> - News data with caching
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
      
      const response = await this.fetchServerSide<NewsResponse>(url, {
        revalidate: 300, // Cache for 5 minutes
      });

      return response;
    } catch (error) {
      console.error('Server: Error fetching news info:', error);
      throw new ApiServiceError(
        error instanceof Error
          ? error.message
          : 'Không thể tải tin tức'
      );
    }
  }

  /**
   * Get news detail by slug (server-side)
   * @param slug - News article slug
   * @param language - Language code (default: 'vi')
   * @returns Promise<NewsDetail> - News detail data
   */
  static async getNewsDetail(slug: string, language: string = 'vi'): Promise<NewsDetail> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('slug', slug);
      searchParams.append('language', language);

      const url = `${this.API_URL}/news_from_slug?${searchParams.toString()}`;

      const response = await this.fetchServerSide<NewsDetail>(url, {
        revalidate: 600, // Cache for 10 minutes
      });

      return response;
    } catch (error) {
      console.error('Server: Error fetching news detail:', error);
      
      if (error instanceof ApiServiceError && error.statusCode === 404) {
        throw new ApiServiceError('Tin tức không tồn tại', 404);
      }
      
      throw new ApiServiceError(
        error instanceof Error
          ? error.message
          : 'Không thể tải chi tiết tin tức'
      );
    }
  }

  /**
   * Get recent news with default date range (last 30 days)
   * @param ticker - Stock ticker symbol
   * @param sentiment - Optional sentiment filter
   * @param page - Page number (default: 1)
   * @param pageSize - Page size (default: 12)
   * @returns Promise<NewsResponse> - Recent news data
   */
  static async getRecentNews(
    ticker: string, 
    sentiment?: string, 
    page: number = 1, 
    pageSize: number = 12
  ): Promise<NewsResponse> {
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
   * Get news for general listing (without ticker filter)
   * @param params - News API parameters without required ticker
   * @returns Promise<NewsResponse> - News data
   */
  static async getGeneralNews(params: Omit<NewsApiParams, 'ticker'> & { ticker?: string }): Promise<NewsResponse> {
    const defaultParams: NewsApiParams = {
      page: 1,
      ticker: 'VN30', // Default to VN30 for general news
      page_size: 20,
      language: 'vi',
      ...params,
    };

    return this.getNewsInfo(defaultParams);
  }

  /**
   * Generate metadata for news detail page
   * @param slug - News article slug
   * @returns Promise<Metadata> - Next.js metadata object
   */
  static async generateNewsDetailMetadata(slug: string): Promise<Metadata> {
    try {
      const newsDetail = await this.getNewsDetail(slug);
      
      return {
        title: `${newsDetail.news_title} | IQX Vietnam Stock Express`,
        description: newsDetail.news_short_content || newsDetail.summary,
        openGraph: {
          title: newsDetail.news_title,
          description: newsDetail.news_short_content || newsDetail.summary,
          images: newsDetail.news_image_url ? [newsDetail.news_image_url] : undefined,
          type: 'article',
          publishedTime: newsDetail.update_date,
        },
        twitter: {
          card: 'summary_large_image',
          title: newsDetail.news_title,
          description: newsDetail.news_short_content || newsDetail.summary,
          images: newsDetail.news_image_url ? [newsDetail.news_image_url] : undefined,
        },
        keywords: [
          newsDetail.ticker,
          newsDetail.industry,
          'tin tức chứng khoán',
          'thị trường chứng khoán Việt Nam',
          newsDetail.news_from_name,
        ].filter(Boolean),
      };
    } catch (error) {
      console.error('Error generating news metadata:', error);
      
      return {
        title: 'Tin tức | IQX Vietnam Stock Express',
        description: 'Tin tức và thông tin về thị trường chứng khoán Việt Nam',
      };
    }
  }

  /**
   * Generate metadata for news listing page
   * @param params - News listing parameters
   * @returns Metadata - Next.js metadata object
   */
  static generateNewsListMetadata(params?: {
    ticker?: string;
    sentiment?: string;
    page?: number;
  }): Metadata {
    const { ticker, sentiment, page } = params || {};
    
    let title = 'Tin tức chứng khoán';
    let description = 'Tin tức và thông tin mới nhất về thị trường chứng khoán Việt Nam';
    
    if (ticker) {
      title = `Tin tức về ${ticker}`;
      description = `Tin tức và thông tin mới nhất về cổ phiếu ${ticker}`;
    }
    
    if (sentiment) {
      const sentimentText = sentiment === 'Positive' ? 'tích cực' : 
                           sentiment === 'Negative' ? 'tiêu cực' : 'trung tính';
      title += ` - Tin ${sentimentText}`;
    }
    
    if (page && page > 1) {
      title += ` - Trang ${page}`;
    }
    
    title += ' | IQX Vietnam Stock Express';
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  /**
   * Check if news article exists by slug
   * @param slug - News article slug
   * @returns Promise<boolean> - Whether news exists
   */
  static async newsExists(slug: string): Promise<boolean> {
    try {
      await this.getNewsDetail(slug);
      return true;
    } catch (error) {
      if (error instanceof ApiServiceError && error.statusCode === 404) {
        return false;
      }
      // For other errors, assume it exists to avoid false negatives
      return true;
    }
  }
}
