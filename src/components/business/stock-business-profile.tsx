"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Building2,
  Target,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Star
} from "lucide-react";
import { StockSummary } from "@/types";
import { renderHtmlContent } from "@/utils";

interface StockBusinessProfileProps {
  ticker: string;
  summary: StockSummary;
  className?: string;
}

const StockBusinessProfile: React.FC<StockBusinessProfileProps> = ({ ticker, summary, className }) => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'strategy' | 'risks'>('overview');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe number formatting that works consistently on server and client
  const formatNumber = (value: number) => {
    if (!isClient) {
      // Server-side: use simple formatting without locale
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    // Client-side: use locale formatting
    return value.toLocaleString('vi-VN');
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return formatNumber(value);
  };

  const formatPrice = (price: number) => {
    return formatNumber(price);
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      low: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
      medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
      high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
    };
    return colors[level.toLowerCase() as keyof typeof colors] || 'text-muted-foreground bg-muted border-border';
  };

  const getSignalColor = (signal: string) => {
    const colors = {
      bullish: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
      bearish: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
      neutral: 'text-muted-foreground bg-muted border-border'
    };
    return colors[signal.toLowerCase() as keyof typeof colors] || 'text-muted-foreground bg-muted border-border';
  };

  const renderStars = (rating: number, label?: string) => {
    return (
      <div className="flex items-center" role="img" aria-label={`${label || 'Rating'}: ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => {
          const isActive = i < rating;
          return (
            <Star
              key={i}
              className={`w-3 h-3 ${isActive ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`}
              aria-hidden="true"
            />
          );
        })}
      </div>
    );
  };

  // Enhanced accessibility helper for price changes
  const getPriceChangeAnnouncement = (change: number, netChange: number) => {
    const direction = change > 0 ? 'increased' : change < 0 ? 'decreased' : 'unchanged';
    return `Stock price has ${direction} by ${Math.abs(change).toFixed(2)} percent, or ${Math.abs(netChange)} VND`;
  };





  return (
    <div className={`${className}`} role="main" aria-label={`Stock information for ${ticker} - ${summary.nameVi}`}>
      {/* Main Stock Info Card - Compact Layout */}
      <Card className="border-0 shadow-sm" role="region" aria-labelledby="stock-header">
        <CardContent className="p-6">
          {/* Modern Header Section with Improved Hierarchy */}
          <div className="space-y-6">
            {/* Primary Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-4">
                {/* Company Logo with Better Responsive Sizing */}
                <div className="relative shrink-0">
                  <Image
                    src={summary.imageUrl}
                    alt={`${ticker} company logo`}
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-contain p-2 border-2 bg-white shadow-sm transition-transform hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/64x64/6366F1/FFFFFF?text=${ticker}`;
                    }}
                  />
                  {/* Status indicator for active trading */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                       aria-label="Currently trading" />
                </div>

                {/* Company Information with Better Typography */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 id="stock-header" className="text-xl sm:text-2xl font-bold tracking-tight">{ticker}</h1>
                    <div className="flex items-center gap-2" role="group" aria-label="Stock exchange and risk information">
                      <Badge variant="secondary" className="text-xs font-medium" aria-label={`Listed on ${summary.stockExchange} exchange`}>
                        {summary.stockExchange}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${getRiskLevelColor(summary.overallRiskLevel)}`}
                        aria-label={`Investment risk level: ${summary.overallRiskLevel}`}
                        role="status"
                      >
                        {summary.overallRiskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1 line-clamp-1" aria-label={`Company name: ${summary.nameVi}`}>
                    {summary.nameVi}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-1" aria-label={`Industry: ${summary.industryActivity}, Sector: ${summary.bcEconomicSectorName}`}>
                    {summary.industryActivity} • {summary.bcEconomicSectorName}
                  </p>
                </div>
              </div>

              {/* Enhanced Price Section */}
              <div className="text-left sm:text-right shrink-0" role="region" aria-labelledby="price-info">
                <div className="flex flex-col items-start sm:items-end">
                  <div className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums" id="price-info" aria-label={`Current stock price: ${formatPrice(summary.priceClose)} Vietnamese Dong`}>
                    {formatPrice(summary.priceClose)}
                    <span className="text-base sm:text-lg font-normal text-muted-foreground ml-2">VND</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm sm:text-base font-medium ${getPriceChangeColor(summary.pctChange)}`}
                    aria-label={getPriceChangeAnnouncement(summary.pctChange, summary.netChange)}
                    role="status"
                    aria-live="polite"
                  >
                    {summary.pctChange > 0 ? (
                      <TrendingUp className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span className="tabular-nums">
                      {summary.pctChange > 0 ? '+' : ''}{formatNumber(summary.netChange)}
                      ({summary.pctChange > 0 ? '+' : ''}{summary.pctChange.toFixed(2)}%)
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-2 text-xs ${getSignalColor(summary.taSignal1d)}`}
                    aria-label={`Technical analysis signal: ${summary.taSignal1d}`}
                    role="status"
                  >
                    Tín hiệu: {summary.taSignal1d.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Table-style Metrics Layout - Similar to Reference Image */}
          <div className="bg-card border rounded-lg p-4">
            {/* Metrics Grid - Table Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              {/* Row 1 */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Vốn hóa</div>
                <div className="text-sm font-semibold tabular-nums">{formatCurrency(summary.marketCap)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">P/E</div>
                <div className="text-sm font-semibold tabular-nums">{summary.peRatio.toFixed(2)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">EPS</div>
                <div className="text-sm font-semibold tabular-nums">{formatNumber(summary.epsRatio)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Chất lượng doanh nghiệp</div>
                <div className="text-sm font-semibold">
                  <span className="text-orange-500">Không ổn định</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Khối lượng giao dịch</div>
                <div className="text-sm font-semibold tabular-nums">{formatCurrency(summary.volume)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">P/B</div>
                <div className="text-sm font-semibold tabular-nums">{summary.pbRatio.toFixed(2)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Giá trị sổ sách</div>
                <div className="text-sm font-semibold tabular-nums">{formatNumber(summary.bookValue)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Rủi ro</div>
                <div className="text-sm font-semibold">
                  <span className="text-yellow-500">Trung bình</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Số lượng cổ phiếu lưu hành</div>
                <div className="text-sm font-semibold tabular-nums">{formatNumber(summary.outstandingSharesValue)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">EV/EBITDA</div>
                <div className="text-sm font-semibold tabular-nums">{summary.evEbitdaRatio.toFixed(2)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Theo dõi</div>
                <div className="text-sm font-semibold tabular-nums">{formatNumber(summary.watchlistCount || 0)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Định giá</div>
                <div className="text-sm font-semibold">
                  <span className="text-green-500">Hấp dẫn</span>
                </div>
              </div>
            </div>

            {/* Expandable Section */}
            <details className="group mt-4 pt-4 border-t">
              <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                <span>Chi tiết</span>
                <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Performance */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Biến động giá</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">7 ngày</span>
                      <span className={`text-sm font-semibold tabular-nums ${getPriceChangeColor(summary.pricePctChg7d)}`}>
                        {summary.pricePctChg7d > 0 ? '+' : ''}{summary.pricePctChg7d.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">30 ngày</span>
                      <span className={`text-sm font-semibold tabular-nums ${getPriceChangeColor(summary.pricePctChg30d)}`}>
                        {summary.pricePctChg30d > 0 ? '+' : ''}{summary.pricePctChg30d.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">YTD</span>
                      <span className={`text-sm font-semibold tabular-nums ${getPriceChangeColor(summary.pricePctChgYtd)}`}>
                        {summary.pricePctChgYtd > 0 ? '+' : ''}{summary.pricePctChgYtd.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Hiệu suất</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">ROE</span>
                      <span className={`text-sm font-semibold tabular-nums ${summary.roe > 15 ? 'text-green-600' : 'text-foreground'}`}>
                        {summary.roe.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">ROA</span>
                      <span className="text-sm font-semibold tabular-nums">{summary.roa.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Beta</span>
                      <span className="text-sm font-semibold tabular-nums">{summary.beta5y.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Scores */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Điểm phân tích</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Định giá</span>
                      <div className="flex items-center gap-1">
                        {renderStars(summary.valuationPoint, "Valuation score")}
                        <span className="text-xs tabular-nums text-muted-foreground">{summary.valuationPoint}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Tăng trưởng</span>
                      <div className="flex items-center gap-1">
                        {renderStars(summary.growthPoint, "Growth score")}
                        <span className="text-xs tabular-nums text-muted-foreground">{summary.growthPoint}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Tài chính</span>
                      <div className="flex items-center gap-1">
                        {renderStars(summary.financialHealthPoint, "Financial health score")}
                        <span className="text-xs tabular-nums text-muted-foreground">{summary.financialHealthPoint}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* Business Information - Tab-based Compact Design */}
      <div className="mt-6" role="region" aria-labelledby="business-info">
        <Card className="border-0 shadow-sm">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mb-4 bg-muted/30 p-1 rounded-lg overflow-x-auto sm:overflow-visible -mx-2 px-2 sm:mx-0 snap-x snap-mandatory">
              <button
                onClick={() => setActiveTab('overview')}
                className={`sm:flex-1 shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap snap-start ${
                  activeTab === 'overview'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                aria-pressed={activeTab === 'overview'}
              >
                <Building2 className="w-4 h-4" aria-hidden="true" />
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`sm:flex-1 shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap snap-start ${
                  activeTab === 'services'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                aria-pressed={activeTab === 'services'}
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                Dịch vụ
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`sm:flex-1 shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap snap-start ${
                  activeTab === 'strategy'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                aria-pressed={activeTab === 'strategy'}
              >
                <Target className="w-4 h-4" aria-hidden="true" />
                Chiến lược
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`sm:flex-1 shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap snap-start ${
                  activeTab === 'risks'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                aria-pressed={activeTab === 'risks'}
              >
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                Rủi ro
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[120px]">
              {activeTab === 'overview' && summary.businessLine && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  <h3 id="business-info" className="text-sm font-semibold text-foreground">Tổng quan doanh nghiệp</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground overflow-y-auto pr-2">
                    {renderHtmlContent(summary.businessLine)}
                  </div>
                </div>
              )}

              {activeTab === 'services' && summary.mainService && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  <h3 className="text-sm font-semibold text-foreground">Dịch vụ chính</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground overflow-y-auto pr-2">
                    {renderHtmlContent(summary.mainService)}
                  </div>
                </div>
              )}

              {activeTab === 'strategy' && summary.businessStrategy && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  <h3 className="text-sm font-semibold text-foreground">Chiến lược kinh doanh</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground overflow-y-auto pr-2">
                    {renderHtmlContent(summary.businessStrategy)}
                  </div>
                </div>
              )}

              {activeTab === 'risks' && summary.businessRisk && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  <h3 className="text-sm font-semibold text-foreground">Rủi ro kinh doanh</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground overflow-y-auto pr-2">
                    {renderHtmlContent(summary.businessRisk)}
                  </div>
                </div>
              )}

              {/* Fallback when no content */}
              {((activeTab === 'overview' && !summary.businessLine) ||
                (activeTab === 'services' && !summary.mainService) ||
                (activeTab === 'strategy' && !summary.businessStrategy) ||
                (activeTab === 'risks' && !summary.businessRisk)) && (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                  Không có thông tin
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StockBusinessProfile;
