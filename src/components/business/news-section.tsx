"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
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
  CalendarDays,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsService } from '@/services/newsService';
import { NewsInfo, NewsSentiment } from '@/types/news';

interface NewsSectionProps {
  ticker: string;
  className?: string;
}

interface SentimentCounts {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

export default function NewsSection({ ticker, className }: NewsSectionProps) {
  const [news, setNews] = useState<NewsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSentiment, setSelectedSentiment] = useState<NewsSentiment>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sentimentCounts, setSentimentCounts] = useState<SentimentCounts>({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  // Date filter states
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  const pageSize = 12;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Initialize default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Fetch sentiment counts
  useEffect(() => {
    const fetchSentimentCounts = async () => {
      if (!dateFrom || !dateTo) return;

      try {
        const counts = await NewsService.getNewsSentimentCounts(ticker, dateFrom, dateTo);
        setSentimentCounts(counts);
      } catch (error) {
        console.error('Error fetching sentiment counts:', error);
      }
    };

    if (ticker && dateFrom && dateTo) {
      fetchSentimentCounts();
    }
  }, [ticker, dateFrom, dateTo]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      if (!dateFrom || !dateTo) return;

      try {
        setLoading(true);
        setError(null);

        const response = await NewsService.getNewsInfo({
          page: currentPage,
          ticker,
          update_from: dateFrom,
          update_to: dateTo,
          sentiment: selectedSentiment || undefined,
          language: 'vi',
          page_size: pageSize,
        });

        setNews(response.news_info);
        setTotalRecords(response.total_records);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Không thể tải tin tức. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [ticker, selectedSentiment, currentPage, dateFrom, dateTo]);

  const handleSentimentChange = (sentiment: NewsSentiment) => {
    setSelectedSentiment(sentiment);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateFromChange = (date: string) => {
    setDateFrom(date);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleDateToChange = (date: string) => {
    setDateTo(date);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const resetDateFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setCurrentPage(1);
  };

  const setDateRange = (days: number) => {
    const today = new Date();
    const fromDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSentimentIcon = (sentiment: NewsSentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: NewsSentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

        {/* Date Filter Toggle */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDateFilters(!showDateFilters)}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              {showDateFilters ? 'Ẩn bộ lọc ngày' : 'Lọc theo ngày'}
            </Button>
            {showDateFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDateFilters}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Đặt lại
              </Button>
            )}
          </div>
          {dateFrom && dateTo && (
            <div className="text-sm text-muted-foreground">
              {formatDate(dateFrom)} - {formatDate(dateTo)}
            </div>
          )}
        </div>

        {/* Date Filters */}
        {showDateFilters && (
          <div className="space-y-4 mt-4 p-4 bg-muted/50 rounded-lg">
            {/* Quick Date Range Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Chọn nhanh
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(7)}
                  className="text-xs"
                >
                  7 ngày
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(30)}
                  className="text-xs"
                >
                  30 ngày
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(90)}
                  className="text-xs"
                >
                  3 tháng
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange(180)}
                  className="text-xs"
                >
                  6 tháng
                </Button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sentiment Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={selectedSentiment === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSentimentChange('')}
            className="flex items-center gap-2"
          >
            <Newspaper className="h-4 w-4" />
            Tất cả ({sentimentCounts.total})
          </Button>
          <Button
            variant={selectedSentiment === 'Positive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSentimentChange('Positive')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4 text-green-600" />
            Tích cực ({sentimentCounts.positive})
          </Button>
          <Button
            variant={selectedSentiment === 'Negative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSentimentChange('Negative')}
            className="flex items-center gap-2"
          >
            <TrendingDown className="h-4 w-4 text-red-600" />
            Tiêu cực ({sentimentCounts.negative})
          </Button>
          <Button
            variant={selectedSentiment === 'Neutral' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSentimentChange('Neutral')}
            className="flex items-center gap-2"
          >
            <Minus className="h-4 w-4 text-gray-600" />
            Trung tính ({sentimentCounts.neutral})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(item.news_source_link, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRecords)} trong tổng số {totalRecords} tin tức
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
