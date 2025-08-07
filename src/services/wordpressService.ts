/**
 * WordPress API Service
 * Service for interacting with WordPress REST API
 */

import {
  WordPressPost,
  WordPressCategory,
  WordPressPostsParams,
  WordPressCategoriesParams,
  WordPressPostsResponse,
  WordPressCategoriesResponse,
  WordPressSinglePostResponse,

} from '@/types/wordpress';

const BASE_URL = 'https://news.iqx.vn';
const API_BASE = '/wp-json/news-api/v1';

class WordPressService {
  private async fetchApi<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${BASE_URL}${API_BASE}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('WordPress API Error:', error);
      throw error;
    }
  }

  /**
   * Get categories
   */
  async getCategories(params?: WordPressCategoriesParams): Promise<WordPressCategory[]> {
    const response = await this.fetchApi<WordPressCategoriesResponse>('/categories', params as Record<string, unknown>);
    return response.data;
  }

  /**
   * Get posts
   */
  async getPosts(params?: WordPressPostsParams): Promise<WordPressPostsResponse> {
    return this.fetchApi<WordPressPostsResponse>('/posts', params as Record<string, unknown>);
  }

  /**
   * Get post by ID
   */
  async getPostById(id: number): Promise<WordPressPost> {
    const response = await this.fetchApi<WordPressSinglePostResponse>(`/posts/${id}`);
    return response.data;
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string): Promise<WordPressPost> {
    const response = await this.fetchApi<WordPressSinglePostResponse>(`/posts/slug/${slug}`);
    return response.data;
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, params?: Omit<WordPressPostsParams, 'search'>): Promise<WordPressPostsResponse> {
    return this.getPosts({ ...params, search: query });
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(categoryId: number, params?: Omit<WordPressPostsParams, 'category'>): Promise<WordPressPostsResponse> {
    return this.getPosts({ ...params, category: String(categoryId) });
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(params?: Omit<WordPressPostsParams, 'featured'>): Promise<WordPressPostsResponse> {
    return this.getPosts({ ...params, featured: true });
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit: number = 10): Promise<WordPressPost[]> {
    const response = await this.getPosts({
      per_page: limit,
      orderby: 'date',
      order: 'desc',
    });
    return response.data;
  }

  /**
   * Get posts with pagination info
   */
  async getPostsWithPagination(params?: WordPressPostsParams) {
    const response = await this.getPosts(params);
    return {
      posts: response.data,
      pagination: response.pagination,
      total: response.pagination?.total_items || 0,
      totalPages: response.pagination?.total_pages || 0,
      currentPage: response.pagination?.current_page || 1,
      hasNext: response.pagination?.has_next || false,
      hasPrevious: response.pagination?.has_previous || false,
    };
  }
}

export const wordpressService = new WordPressService();
export default wordpressService;
