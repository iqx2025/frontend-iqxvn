import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsImage } from '@/components/ui/news-image';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServerNewsService } from '@/services/serverNewsService';
import { NewsInfo, NewsSentiment } from '@/types/news';

interface NewsSectionServerProps {
  ticker: string;
  className?: string;
  searchParams?: {
    page?: string;
    sentiment?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

interface SentimentCounts {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

// Helper functions
const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive':
      return <TrendingUp className="h-4 w-4" />;
    case 'Negative':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Minus className="h-4 w-4" />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Negative':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const calculateSentimentCounts = (news: NewsInfo[]): SentimentCounts => {
  const counts = news.reduce(
    (acc, item) => {
      acc.total++;
      switch (item.sentiment) {
        case 'Positive':
          acc.positive++;
          break;
        case 'Negative':
          acc.negative++;
          break;
        default:
          acc.neutral++;
      }
      return acc;
    },
    { total: 0, positive: 0, negative: 0, neutral: 0 }
  );
  return counts;
};

export default async function NewsSectionServer({ 
  ticker, 
  className, 
  searchParams = {} 
}: NewsSectionServerProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedSentiment = searchParams.sentiment as NewsSentiment || '';
  const pageSize = 12;

  // Set default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const dateFrom = searchParams.dateFrom || thirtyDaysAgo.toISOString().split('T')[0];
  const dateTo = searchParams.dateTo || today.toISOString().split('T')[0];

  let news: NewsInfo[] = [];
  let totalRecords = 0;
  let error: string | null = null;

  try {
    const response = await ServerNewsService.getNewsInfo({
      page: currentPage,
      ticker,
      update_from: dateFrom,
      update_to: dateTo,
      sentiment: selectedSentiment || undefined,
      language: 'vi',
      page_size: pageSize,
    });

    news = response.news_info;
    totalRecords = response.total_records;
  } catch (err) {
    console.error('Error fetching news:', err);
    error = 'Không thể tải tin tức. Vui lòng thử lại sau.';
  }

  const sentimentCounts = calculateSentimentCounts(news);
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Generate filter URLs
  const createFilterUrl = (newSentiment: string) => {
    const params = new URLSearchParams();
    if (newSentiment && newSentiment !== selectedSentiment) {
      params.set('sentiment', newSentiment);
    }
    if (searchParams.page && searchParams.page !== '1') {
      params.set('page', '1'); // Reset to first page when changing filters
    }
    return params.toString() ? `?${params.toString()}` : '';
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (selectedSentiment) params.set('sentiment', selectedSentiment);
    return params.toString() ? `?${params.toString()}` : '';
  };

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Tin tức về {ticker}
        </CardTitle>

        {/* Sentiment Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link href={createFilterUrl('')}>
            <Button
              variant={!selectedSentiment ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Newspaper className="h-4 w-4" />
              Tất cả ({sentimentCounts.total})
            </Button>
          </Link>
          <Link href={createFilterUrl('Positive')}>
            <Button
              variant={selectedSentiment === 'Positive' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4 text-green-600" />
              Tích cực ({sentimentCounts.positive})
            </Button>
          </Link>
          <Link href={createFilterUrl('Negative')}>
            <Button
              variant={selectedSentiment === 'Negative' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <TrendingDown className="h-4 w-4 text-red-600" />
              Tiêu cực ({sentimentCounts.negative})
            </Button>
          </Link>
          <Link href={createFilterUrl('Neutral')}>
            <Button
              variant={selectedSentiment === 'Neutral' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Minus className="h-4 w-4 text-gray-600" />
              Trung tính ({sentimentCounts.neutral})
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không có tin tức nào được tìm thấy.</p>
          </div>
        ) : (
          <>
            {/* News List */}
            <div className="space-y-4">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/tin-tuc-ai/${item.slug}`}
                  className="block"
                >
                  <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    {/* News Image */}
                    {item.news_image_url && (
                      <div className="flex-shrink-0">
                        <NewsImage
                          src={item.news_image_url}
                          alt={item.news_title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    )}

                    {/* News Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
                          {item.news_title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getSentimentColor(item.sentiment))}
                          >
                            {getSentimentIcon(item.sentiment)}
                            {item.sentiment || 'Neutral'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.news_short_content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.update_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(item.update_date)}
                          </div>
                          <span className="text-blue-600">{item.news_from_name}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-blue-600 hover:text-blue-800"
                          asChild
                        >
                          <a
                            href={item.news_source_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages} ({totalRecords} tin tức)
                </div>
                
                <div className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <Link href={createPageUrl(currentPage - 1)}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>
                    </Link>
                  )}
                  
                  {currentPage < totalPages && (
                    <Link href={createPageUrl(currentPage + 1)}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
