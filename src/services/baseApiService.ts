/**
 * Base API Service
 * Provides unified API calling patterns, error handling, and response processing
 */

import { StockApiResponse, RetryConfig } from '@/types/stock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

/**
 * Default retry configuration for API calls
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 2000,
  currentAttempt: 0,
};

/**
 * Custom error class for API service errors
 */
export class ApiServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiServiceError';
  }
}

/**
 * Base API Service class with unified patterns
 */
export class BaseApiService {
  /**
   * Makes a fetch request with standardized error handling
   */
  protected static async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiServiceError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ApiServiceError) {
        throw error;
      }
      
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Unknown API error',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Makes a server-side fetch request with caching
   */
  protected static async fetchServerSide<T>(
    url: string,
    options?: RequestInit & { revalidate?: number }
  ): Promise<T> {
    try {
      const { revalidate = 300, ...fetchOptions } = options || {};
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        next: { 
          revalidate 
        },
        ...fetchOptions,
      });

      if (!response.ok) {
        throw new ApiServiceError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Server API Error:', error);
      
      if (error instanceof ApiServiceError) {
        throw error;
      }
      
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Unknown server API error',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Retry wrapper for API calls
   */
  protected static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;

    for (let attempt = 0; attempt < retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on certain error types
        if (error instanceof ApiServiceError && error.statusCode) {
          if (error.statusCode >= 400 && error.statusCode < 500) {
            throw error; // Client errors shouldn't be retried
          }
        }

        // If this is the last attempt, throw the error
        if (attempt === retryConfig.maxAttempts - 1) {
          throw lastError;
        }

        // Wait before retrying with exponential backoff
        const delay = retryConfig.baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Validates API response structure
   */
  protected static validateResponse<T>(response: StockApiResponse<T>): void {
    if (!response.success) {
      throw new ApiServiceError(response.message || 'API request failed');
    }
  }

  /**
   * Gets the full API URL
   */
  protected static getApiUrl(endpoint: string): string {
    return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Gets the internal API URL (for Next.js API routes)
   */
  protected static getInternalApiUrl(endpoint: string): string {
    return `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  /**
   * Handles common API response processing
   */
  protected static processResponse<T>(response: StockApiResponse<T>): T {
    this.validateResponse(response);
    return response.data;
  }
}
