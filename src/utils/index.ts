/**
 * Barrel exports for utility functions
 * Provides a centralized way to import utility functions
 */

// Export all formatting utilities
export * from './formatters';

// Re-export commonly used utilities with more descriptive names
export {
  formatNumber as formatCurrency,
  formatPrice as formatVNDPrice,
  formatPercentage as formatPercent,
  stripHtml as removeHtmlTags,
  sanitizeHtml as cleanHtml,
  renderHtmlContent as renderSafeHtml,
} from './formatters';
