# Market Sentiment Dashboard Documentation

## Overview

The Market Sentiment Dashboard is a comprehensive visualization tool for analyzing market psychology and trends in the Vietnamese stock market. We've created two versions to demonstrate different approaches to layout and visual hierarchy.

## 🎯 Purpose

Provide traders and investors with real-time insights into:
- Overall market sentiment (bullish/bearish/neutral)
- Money flow distribution across stocks
- Market breadth by sector
- Price change distribution
- Historical sentiment trends

## 📊 Components Structure

### Core Components

1. **SentimentGauge** (`sentiment-gauge.tsx`)
   - Speedometer-style visualization
   - 5 color-coded zones (Excessively Pessimistic → Overly Optimistic)
   - Real-time update capability
   - Animated needle pointer

2. **MoneyFlowDistribution** (`money-flow-distribution.tsx`)
   - Vertical bar chart showing trading volume
   - Categories: Tăng (Up), Giảm (Down), Không đổi (Unchanged)
   - Values in trillion VND
   - Percentage breakdown

3. **MarketBreadthChart** (`market-breadth-chart.tsx`)
   - Horizontal bar chart by sector
   - Color-coded performance (green/red)
   - Inline percentage labels
   - Summary statistics

4. **PriceChangeHistogram** (`price-change-histogram.tsx`)
   - Distribution of stock price changes
   - 11 bins from ≤-7% to ≥7%
   - Normal distribution pattern
   - Color-coded ranges

5. **MiniTrendChart** (`mini-trend-chart.tsx`)
   - 30-day historical sentiment line chart
   - Area chart with gradient fill
   - Trend indicator
   - Current value display

## 🏗️ Architecture

### Version 1 - Original Layout
```
┌─────────────────────────────────────┐
│            Header                    │
├─────────────────────────────────────┤
│ ┌─────────────┬─────────────┐       │
│ │   Gauge     │  Money Flow │       │
│ ├─────────────┼─────────────┤       │
│ │   Breadth   │  Histogram  │       │
│ └─────────────┴─────────────┘       │
│ ┌───────────────────────────┐       │
│ │      Trend Chart          │       │
│ └───────────────────────────┘       │
└─────────────────────────────────────┘
```

### Version 2 - Redesigned Layout
```
┌─────────────────────────────────────┐
│     Enhanced Header + Badges        │
├─────────────────────────────────────┤
│     Summary Statistics Cards        │
├─────────────────────────────────────┤
│ Section: Overall Sentiment          │
│ ┌────────┬──────────────────┐      │
│ │ Gauge  │  Trend Chart      │      │
│ └────────┴──────────────────┘      │
├─────────────────────────────────────┤
│ Section: Money Flow & Distribution  │
│ ┌─────────────┬─────────────┐      │
│ │ Money Flow  │  Histogram   │      │
│ └─────────────┴─────────────┘      │
├─────────────────────────────────────┤
│ Section: Market Breadth             │
│ ┌───────────────────────────┐      │
│ │    Breadth Chart          │      │
│ └───────────────────────────┘      │
└─────────────────────────────────────┘
```

## 🎨 Design Improvements (V2)

### Visual Hierarchy
- **Section Headers**: Clear titles and descriptions for each section
- **Summary Cards**: Key metrics displayed prominently at the top
- **Consistent Spacing**: Uniform gaps and padding throughout
- **Separators**: Visual division between sections

### Enhanced Features
- **Status Badges**: Real-time, Auto-refresh, Last Update indicators
- **Compact Mode**: Optimized layout for mobile devices
- **Better Typography**: Improved font weights and sizes
- **Color Consistency**: Unified color scheme across components

### Statistics Summary
- Current sentiment percentage with trend indicator
- Market breadth calculation (positive vs negative stocks)
- Total trading volume
- Percentage of rising stocks

## 🔧 Configuration Options

### Dashboard Props

```typescript
interface DashboardProps {
  className?: string;        // Additional CSS classes
  useMock?: boolean;         // Use mock data (default: true)
  enableRealtime?: boolean;  // Enable real-time updates
  refreshInterval?: number;  // Auto-refresh interval (ms)
  compact?: boolean;         // Compact mode (V2 only)
}
```

### Usage Examples

```tsx
// Basic usage
<MarketSentimentDashboardV2 />

// With real-time updates
<MarketSentimentDashboardV2 
  enableRealtime={true}
/>

// With auto-refresh (30 seconds)
<MarketSentimentDashboardV2 
  refreshInterval={30000}
/>

// Compact mode for mobile
<MarketSentimentDashboardV2 
  compact={true}
/>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (optimized grid)

### Adaptive Features
- Stacked layout on mobile
- Reduced chart heights in compact mode
- Responsive font sizes
- Touch-friendly interactions

## 🌐 Internationalization

Currently supports Vietnamese language with:
- Localized labels and descriptions
- Vietnamese number formatting
- Local date/time formatting
- Cultural color associations

## 🚀 Performance Optimizations

- **Lazy Loading**: Charts render on demand
- **Memoization**: Expensive calculations cached
- **Debounced Updates**: Prevents excessive re-renders
- **Optimized Animations**: GPU-accelerated transitions

## 📊 Data Structure

### Market Sentiment Payload
```typescript
{
  gauge: {
    percent: number;      // 0-100
    updatedAt: string;    // ISO timestamp
  },
  moneyFlow: [
    { label: string, value: number, color: string }
  ],
  breadth: [
    { sector: string, pct: number, count?: number }
  ],
  distribution: [
    { range: string, count: number, rangeStart?: number, rangeEnd?: number }
  ],
  history: [
    { date: string, value: number, volume?: number }
  ],
  timestamp?: string;
}
```

## 🔄 API Integration

### Current Implementation
- Mock data service for development
- Hook-based data fetching
- Ready for backend integration

### Future Integration
```typescript
// When backend is ready, update useMarketSentiment hook:
const response = await ApiService.getMarketSentiment();
// Instead of:
const result = await getMockMarketSentiment();
```

## 📁 File Structure

```
src/
├── components/data-display/
│   ├── market-sentiment-dashboard.tsx      # Version 1
│   ├── market-sentiment-dashboard-v2.tsx   # Version 2 (Redesigned)
│   ├── market-sentiment-comparison.tsx     # Comparison tool
│   ├── sentiment-gauge.tsx
│   ├── money-flow-distribution.tsx
│   ├── market-breadth-chart.tsx
│   ├── price-change-histogram.tsx
│   └── mini-trend-chart.tsx
├── hooks/
│   └── useMarketSentiment.ts
├── services/mock/
│   └── marketSentiment.ts
├── types/
│   └── market-sentiment.ts
└── app/thu-nghiem/sentiment-demo/
    └── page.tsx
```

## 🧪 Testing

Access the demo at: `http://localhost:8081/thu-nghiem/sentiment-demo`

### Test Scenarios
1. **Data Loading**: Verify mock data loads correctly
2. **Refresh Function**: Test manual refresh button
3. **Real-time Updates**: Check gauge animation
4. **Auto-refresh**: Verify 30-second interval
5. **Responsive Layout**: Test on different screen sizes
6. **Dark Mode**: Verify theme compatibility

## 🎯 Key Improvements Summary

### Version 2 Advantages
✅ Better visual hierarchy with sections  
✅ Summary statistics at the top  
✅ Consistent spacing and alignment  
✅ Enhanced header with status badges  
✅ Improved responsive design  
✅ Compact mode for mobile  
✅ Better loading/error states  
✅ More structured data organization  

## 🔮 Future Enhancements

- [ ] Add drill-down functionality for sectors
- [ ] Implement historical comparison views
- [ ] Add export functionality (PDF/PNG)
- [ ] Include more technical indicators
- [ ] Add customizable time ranges
- [ ] Implement user preferences storage
- [ ] Add WebSocket for real-time updates
- [ ] Include alert/notification system

## 📝 Notes

- All components use `"use client"` directive for client-side rendering
- Charts use Recharts library for consistency
- Styling uses Tailwind CSS with shadcn/ui components
- Dark mode is fully supported via CSS variables
- Vietnamese language is the primary locale

---

**Last Updated**: August 2025  
**Version**: 2.0  
**Status**: Production Ready
