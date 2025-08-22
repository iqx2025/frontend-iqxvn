# VNIndexChart Component Updates

## Overview
The VNIndexChart component has been enhanced with a comprehensive right-side statistics panel that displays key market data alongside the existing chart visualization.

## New Features

### 1. Statistics Panel Layout
- **Responsive Design**: The panel appears on the right side on large screens (lg and above) and stacks below the chart on smaller screens
- **Width**: Fixed 320px width (lg:w-80) on large screens
- **Sections**: Three distinct sections separated by dividers

### 2. Trading Session Statistics
Located at the top of the panel, displays:
- **Opening Price** (Mở cửa)
- **Highest Price** (Cao nhất) - with green color indication
- **Lowest Price** (Thấp nhất) - with red color indication
- **Closing Price** (Đóng cửa)

### 3. Volume Statistics
Middle section showing:
- **Total Volume** (Tổng khối lượng) - displayed in millions
- **Transaction Value** (Giá trị giao dịch) - displayed in billion VND with dollar sign icon
- **Average Volume** (KL trung bình) - calculated from the period data

### 4. Market Summary
Bottom section featuring:
- **Advancing Stocks** (Tăng) - green background with up arrow icon
- **Declining Stocks** (Giảm) - red background with down arrow icon
- **Unchanged Stocks** (Đứng) - yellow background with minus icon
- **Total Stocks Count** - sum of all categories
- **Visual Progress Bar** - showing the proportion of advances/declines/unchanged

## Visual Enhancements

### Icons
Added new Lucide React icons for better visual clarity:
- `ArrowUp`, `ArrowDown`, `Minus` - for market direction indicators
- `Clock` - for trading session section
- `ChartBar` - for volume section
- `ChartLine` - for market statistics section
- `DollarSign` - for transaction value

### Color Scheme
- **Green** (bg-green-50/900): Positive movements and advancing stocks
- **Red** (bg-red-50/900): Negative movements and declining stocks
- **Yellow** (bg-yellow-50/900): Unchanged stocks
- **Muted backgrounds** (bg-muted/30): Section backgrounds for subtle separation

### Typography
- Clear hierarchy with text sizes:
  - `text-lg` for main values
  - `text-sm` for labels
  - `text-xs` for secondary information
- Font weights to emphasize important data (font-semibold, font-bold)

## Data Integration

### Current Implementation
- Market statistics are currently simulated with random values
- In production, these should be fetched from a market summary API endpoint

### Recommended API Integration
```typescript
// Example API response structure needed:
interface MarketSummaryData {
  advances: number;    // Number of advancing stocks
  declines: number;    // Number of declining stocks
  unchanged: number;   // Number of unchanged stocks
  totalVolume: number; // Total market volume
  totalValue: number;  // Total transaction value
}
```

## Responsive Behavior
- **Desktop (lg+)**: Chart and panel side-by-side
- **Tablet/Mobile**: Panel stacks below chart
- All text and spacing adjusts for optimal mobile viewing

## Component Usage
The component maintains backward compatibility - no changes needed in parent components:

```tsx
<VNIndexChart height={350} />
```

## Future Enhancements
1. Real-time data updates via WebSocket
2. Add more detailed statistics (52-week high/low, P/E ratio, etc.)
3. Clickable statistics to show detailed breakdowns
4. Export data functionality
5. Comparison with other indices (HNX, UPCOM)
