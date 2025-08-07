/**
 * Utility functions for formatting numbers, prices, and other data
 * Consolidated utility functions for consistent data formatting across the application
 */

import React from 'react';

/**
 * Safely formats a number with appropriate suffixes (K, M, B, T)
 * Handles null, undefined, and invalid values gracefully
 */
export const formatNumber = (num: number | string | null | undefined): string => {
  // Handle null, undefined, or empty string
  if (num === null || num === undefined || num === '') {
    return '0';
  }

  // Convert to number if it's a string
  let value: number;
  if (typeof num === 'string') {
    // Remove any non-numeric characters except decimal point and minus sign
    const cleanedNum = num.replace(/[^\d.-]/g, '');
    value = parseFloat(cleanedNum);
  } else {
    value = num;
  }

  // Handle NaN or invalid numbers
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }

  // Handle negative numbers
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  let formatted: string;

  if (absValue >= 1e12) {
    formatted = `${(absValue / 1e12).toFixed(1)}T`;
  } else if (absValue >= 1e9) {
    formatted = `${(absValue / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    formatted = `${(absValue / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    formatted = `${(absValue / 1e3).toFixed(1)}K`;
  } else {
    formatted = absValue.toLocaleString('vi-VN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  }

  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Formats a price value for Vietnamese market
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }

  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Formats a percentage value
 */
export const formatPercentage = (value: number | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }

  return `${value.toFixed(decimals)}%`;
};

/**
 * Gets the appropriate color class for price changes
 */
export const getPriceChangeColor = (change: number | null | undefined): string => {
  if (change === null || change === undefined || isNaN(change)) {
    return 'text-muted-foreground';
  }

  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-yellow-600 dark:text-yellow-400';
};

/**
 * Gets the appropriate badge variant for price changes
 */
export const getPriceChangeBadgeVariant = (change: number | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
  if (change === null || change === undefined || isNaN(change)) {
    return 'secondary';
  }

  if (change > 0) return 'default';
  if (change < 0) return 'destructive';
  return 'secondary';
};

/**
 * Formats a date string to Vietnamese locale
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Strips HTML tags from a string safely
 */
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return 'Không có thông tin';

  try {
    return html.replace(/<[^>]*>/g, '').trim() || 'Không có thông tin';
  } catch {
    return 'Không có thông tin';
  }
};

/**
 * Strips HTML tags for text-only display with better whitespace handling
 */
export const stripHtmlTags = (html: string | null | undefined): string => {
  if (!html) return '';

  try {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\r\n/g, ' ')
      .replace(/\t/g, ' ')
      .trim();
  } catch {
    return '';
  }
};

/**
 * Truncates HTML content while preserving structure
 */
export const truncateHtmlContent = (html: string, maxLength: number): string => {
  if (!html) return '';

  const textContent = stripHtmlTags(html);

  if (textContent.length <= maxLength) {
    return html;
  }

  // Find a good truncation point
  const truncatedText = textContent.slice(0, maxLength);
  const lastSpace = truncatedText.lastIndexOf(' ');
  const cutPoint = lastSpace > maxLength * 0.8 ? lastSpace : maxLength;

  // For simplicity, return truncated text without HTML
  // In a more sophisticated implementation, you'd preserve HTML structure
  return textContent.slice(0, cutPoint) + '...';
};

/**
 * Safely gets a nested property from an object
 */
export const safeGet = <T>(obj: unknown, path: string, defaultValue: T): T => {
  try {
    const result = path.split('.').reduce((current: Record<string, unknown>, key) => {
      return current?.[key] as Record<string, unknown>;
    }, obj as Record<string, unknown>);
    return result !== undefined && result !== null ? (result as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Validates if a value is a valid number
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Safely converts a value to number with fallback
 */
export const toNumber = (value: unknown, fallback: number = 0): number => {
  if (isValidNumber(value)) return value;
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isValidNumber(parsed) ? parsed : fallback;
  }
  
  return fallback;
};

/**
 * HTML Content Processing Utilities
 */

/**
 * Simple HTML sanitizer for basic content
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  // Clean up the HTML string
  let cleanHtml = html
    .replace(/\r\n/g, '')
    .replace(/\t/g, '')
    .trim();

  // Add CSS classes to HTML elements
  cleanHtml = cleanHtml
    .replace(/<ul>/gi, '<ul class="list-disc list-inside space-y-1 ml-4 my-2">')
    .replace(/<ol>/gi, '<ol class="list-decimal list-inside space-y-1 ml-4 my-2">')
    .replace(/<li>/gi, '<li class="text-sm leading-relaxed">')
    .replace(/<div[^>]*>/gi, '<div class="mb-2">')
    .replace(/<p[^>]*>/gi, '<p class="mb-2 text-sm leading-relaxed">');

  // Remove any potentially dangerous attributes and scripts
  cleanHtml = cleanHtml
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<style[^>]*>.*?<\/style>/gi, ''); // Remove style tags

  return cleanHtml;
};

/**
 * Safe HTML content renderer using dangerouslySetInnerHTML with sanitization
 */
export const renderHtmlContent = (htmlString: string): React.ReactNode => {
  if (!htmlString) return null;

  // Sanitize HTML - only allow safe tags
  const sanitizedHtml = sanitizeHtml(htmlString);

  return React.createElement('div', {
    className: 'html-content space-y-2',
    dangerouslySetInnerHTML: { __html: sanitizedHtml }
  });
};

/**
 * Shareholders-specific formatters
 */

/**
 * Formats Vietnamese currency with appropriate suffixes
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 VND';
  }

  if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(1)} nghìn tỷ VND`;
  }
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} tỷ VND`;
  }
  if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(1)} triệu VND`;
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Gets color class for change values
 */
export const getChangeColor = (changeValue: number): string => {
  if (changeValue > 0) return "text-green-600 dark:text-green-400";
  if (changeValue < 0) return "text-red-600 dark:text-red-400";
  return "text-gray-600 dark:text-gray-400";
};

/**
 * Formats country names for display
 */
export const formatCountryName = (country: string): string => {
  const countryMap: Record<string, string> = {
    'Vietnam': 'Việt Nam',
    'United States': 'Hoa Kỳ',
    'Singapore': 'Singapore',
    'South Korea': 'Hàn Quốc',
    'Japan': 'Nhật Bản',
    'Hong Kong': 'Hồng Kông',
    'Taiwan': 'Đài Loan',
    'United Kingdom': 'Anh',
    'Switzerland': 'Thụy Sĩ',
    'Luxembourg': 'Luxembourg',
    'Thailand': 'Thái Lan',
    'Finland': 'Phần Lan',
    'Sweden': 'Thụy Điển'
  };

  return countryMap[country] || country;
};

/**
 * Financial-specific formatters
 */

/**
 * Formats financial amounts with appropriate Vietnamese currency suffixes
 */
export const formatFinancialAmount = (amount: number | null | undefined, options?: {
  showUnit?: boolean;
  decimals?: number;
  compact?: boolean;
}): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  const { showUnit = true, decimals = 1, compact = true } = options || {};
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;

  let formatted: string;
  let unit = '';

  if (compact) {
    if (absAmount >= 1e12) {
      formatted = (absAmount / 1e12).toFixed(decimals);
      unit = showUnit ? ' nghìn tỷ' : '';
    } else if (absAmount >= 1e9) {
      formatted = (absAmount / 1e9).toFixed(decimals);
      unit = showUnit ? ' tỷ' : '';
    } else if (absAmount >= 1e6) {
      formatted = (absAmount / 1e6).toFixed(decimals);
      unit = showUnit ? ' triệu' : '';
    } else if (absAmount >= 1e3) {
      formatted = (absAmount / 1e3).toFixed(decimals);
      unit = showUnit ? ' nghìn' : '';
    } else {
      formatted = absAmount.toLocaleString('vi-VN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      });
      unit = '';
    }
  } else {
    formatted = absAmount.toLocaleString('vi-VN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
    unit = showUnit ? ' VND' : '';
  }

  return `${isNegative ? '-' : ''}${formatted}${unit}`;
};

/**
 * Formats financial ratios and percentages
 */
export const formatFinancialRatio = (ratio: number | null | undefined, options?: {
  decimals?: number;
  asPercentage?: boolean;
  showSign?: boolean;
}): string => {
  if (ratio === null || ratio === undefined || isNaN(ratio)) {
    return 'N/A';
  }

  const { decimals = 2, asPercentage = false, showSign = false } = options || {};

  let value = ratio;
  let suffix = '';

  if (asPercentage) {
    value = ratio * 100;
    suffix = '%';
  }

  const formatted = value.toFixed(decimals);
  const sign = showSign && ratio > 0 ? '+' : '';

  return `${sign}${formatted}${suffix}`;
};

/**
 * Formats EPS (Earnings Per Share) values
 */
export const formatEPS = (eps: number | null | undefined): string => {
  if (eps === null || eps === undefined || isNaN(eps)) {
    return 'N/A';
  }

  return `${eps.toLocaleString('vi-VN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })} VND`;
};

/**
 * Formats year-over-year changes with appropriate styling indicators
 */
export const formatYoYChange = (current: number | null, previous: number | null): {
  absolute: string;
  percentage: string;
  isPositive: boolean | null;
  isNegative: boolean | null;
} => {
  if (current === null || previous === null || current === undefined || previous === undefined) {
    return {
      absolute: 'N/A',
      percentage: 'N/A',
      isPositive: null,
      isNegative: null
    };
  }

  const absoluteChange = current - previous;
  const percentageChange = previous !== 0 ? (absoluteChange / Math.abs(previous)) * 100 : null;

  return {
    absolute: formatFinancialAmount(absoluteChange, { showUnit: true, decimals: 1 }),
    percentage: percentageChange !== null ? `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%` : 'N/A',
    isPositive: absoluteChange > 0,
    isNegative: absoluteChange < 0
  };
};

/**
 * Formats financial statement periods
 */
export const formatFinancialPeriod = (year: number, quarter?: number): string => {
  if (quarter && quarter >= 1 && quarter <= 4) {
    return `Q${quarter}/${year}`;
  }
  return year.toString();
};

/**
 * Formats financial statement dates
 */
export const formatFinancialDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Gets color class for financial changes
 */
export const getFinancialChangeColor = (change: number | null | undefined): string => {
  if (change === null || change === undefined || isNaN(change)) {
    return 'text-muted-foreground';
  }

  if (change > 0) return 'text-green-600 dark:text-green-400';
  if (change < 0) return 'text-red-600 dark:text-red-400';
  return 'text-muted-foreground';
};

/**
 * Gets badge variant for financial changes
 */
export const getFinancialChangeBadgeVariant = (change: number | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
  if (change === null || change === undefined || isNaN(change)) {
    return 'secondary';
  }

  if (change > 0) return 'default';
  if (change < 0) return 'destructive';
  return 'secondary';
};

/**
 * Formats large financial numbers with appropriate scaling
 */
export const formatLargeFinancialNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const isNegative = value < 0;

  let formatted: string;
  if (absValue >= 1e12) {
    formatted = `${(absValue / 1e12).toFixed(1)}T`;
  } else if (absValue >= 1e9) {
    formatted = `${(absValue / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    formatted = `${(absValue / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    formatted = `${(absValue / 1e3).toFixed(1)}K`;
  } else {
    formatted = absValue.toFixed(0);
  }

  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Formats financial metrics with context-aware formatting
 */
export const formatFinancialMetric = (
  value: number | null | undefined,
  metricType: 'currency' | 'percentage' | 'ratio' | 'count' | 'eps'
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  switch (metricType) {
    case 'currency':
      return formatFinancialAmount(value);
    case 'percentage':
      return formatFinancialRatio(value, { asPercentage: true });
    case 'ratio':
      return formatFinancialRatio(value);
    case 'eps':
      return formatEPS(value);
    case 'count':
      return value.toLocaleString('vi-VN');
    default:
      return formatFinancialAmount(value);
  }
};
