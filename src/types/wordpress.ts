/**
 * WordPress API Types
 * Types for WordPress REST API responses
 */

// Base response structure
export interface WordPressApiResponse<T> {
  success: boolean;
  timestamp: string;
  version: string;
  data: T;
  pagination?: WordPressPagination;
}

export interface WordPressPagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

// Content structure
export interface WordPressContent {
  rendered: string;
  raw?: string;
}

// Author structure
export interface WordPressAuthor {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

// Featured image structure
export interface WordPressFeaturedImage {
  id: number;
  url: string;
  sizes: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
  };
  alt: string;
  caption: string;
}

// Category structure
export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  link: string;
  meta?: {
    color?: string;
    icon?: string;
  };
  children?: WordPressCategory[];
}

// Tag structure
export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
}

// Post structure
export interface WordPressPost {
  id: number;
  title: WordPressContent;
  slug: string;
  status: 'publish' | 'private' | 'draft';
  link: string;
  excerpt: WordPressContent;
  content: WordPressContent;
  date: string;
  author: WordPressAuthor;
  featured_image?: WordPressFeaturedImage;
  categories: WordPressCategory[];
  tags: WordPressTag[];
  custom_fields?: Record<string, any>;
  meta?: {
    reading_time?: number;
    word_count?: number;
  };
}

// API request parameters
export interface WordPressPostsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'menu_order' | 'modified' | 'comment_count';
  order?: 'asc' | 'desc';
  status?: 'publish' | 'private' | 'draft';
  featured?: boolean;
  date_after?: string;
  date_before?: string;
}

export interface WordPressCategoriesParams {
  hierarchical?: boolean;
  hide_empty?: boolean;
  include?: string;
  exclude?: string;
}

// Response types
export type WordPressPostsResponse = WordPressApiResponse<WordPressPost[]>;
export type WordPressCategoriesResponse = WordPressApiResponse<WordPressCategory[]>;
export type WordPressSinglePostResponse = WordPressApiResponse<WordPressPost>;

// Error types
export interface WordPressApiError {
  code: string;
  message: string;
  data?: any;
}
