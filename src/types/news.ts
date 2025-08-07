/**
 * News-related type definitions
 */

export type NewsSentiment = 'Positive' | 'Negative' | 'Neutral' | '';

export interface NewsInfo {
  id: string;
  ticker: string;
  industry: string;
  news_title: string;
  news_short_content: string;
  news_source_link: string;
  news_image_url: string;
  update_date: string;
  news_from: string;
  news_from_name: string;
  sentiment: NewsSentiment;
  score: number;
  slug: string;
  male_audio_duration: number;
  female_audio_duration: number;
}

export interface NewsResponse {
  total_records: number;
  name: string;
  news_info: NewsInfo[];
}

export interface NewsFilters {
  page: number;
  ticker: string;
  industry?: string;
  update_from?: string;
  update_to?: string;
  sentiment?: NewsSentiment;
  newsfrom?: string;
  language?: string;
  page_size: number;
}

export interface NewsApiParams {
  page?: number;
  ticker: string;
  industry?: string;
  update_from?: string;
  update_to?: string;
  sentiment?: NewsSentiment;
  newsfrom?: string;
  language?: string;
  page_size?: number;
}

export interface NewsDetail {
  id: string;
  ticker: string;
  industry: string;
  news_title: string;
  news_short_content: string;
  summary: string;
  highlight_position: string;
  news_full_content: string;
  file_attachment: unknown[];
  news_source_link: string;
  news_image_url: string;
  update_date: string;
  news_from: string;
  sentiment: NewsSentiment;
  score: number;
  slug: string;
  male_audio_duration: number;
  female_audio_duration: number;
  news_type: string;
  news_from_name: string;
}
