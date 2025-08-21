# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for Vietnamese stock market information (IQX - Vietnam Stock Express), using React 19, TypeScript, and Tailwind CSS. The application provides stock market data, financial information, news, and technical analysis charts.

## Development Commands

### Running the Development Server
```bash
# Start development server with Turbopack on port 8081
npm run dev

# Build for production
npm run build

# Start production server on port 3031
npm run start

# Run linting
npm run lint
```

### PM2 Production Deployment
```bash
# Deploy with PM2 (port 3031)
pm2 start ecosystem.config.js

# Reload production
pm2 reload ecosystem.config.js --env production
```

## Architecture

### Application Structure
The app follows Next.js 15 App Router architecture with the following key patterns:

1. **Server Components by Default**: All components are server components unless explicitly marked with `'use client'`
2. **API Proxy Pattern**: Internal API routes proxy requests to backend API to avoid CORS issues
3. **Type-Safe Data Flow**: Comprehensive TypeScript types for all data structures
4. **Service Layer**: Centralized API services for data fetching and transformation

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API proxy routes
│   │   ├── companies/     # Company data endpoints
│   │   └── tv/           # TradingView UDF adapter endpoints
│   ├── ma-chung-khoan/   # Stock ticker pages
│   ├── tin-tuc/          # News pages (server-rendered)
│   └── tin-tuc-ai/       # AI news pages
├── components/            # UI components
│   ├── business/         # Business logic components
│   ├── data-display/     # Data visualization components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── services/             # API services and data transformation
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Key Services

#### API Services (`src/services/`)
- **BaseApiService**: Base class with error handling and retry logic
- **ApiService**: Main API service for company data
- **FinancialService**: Financial data endpoints
- **NewsService**: News content management
- **StockService**: Stock-specific data operations
- **TransformationService**: Data transformation utilities

#### Custom Hooks (`src/hooks/`)
- **useTickerData**: Fetches and manages ticker data with error handling
- **useFinancialData**: Financial data management
- **useStockData**: Real-time stock data subscriptions
- **useSearch**: Search functionality with debouncing
- **useShareholdersData**: Shareholders information

### API Integration

#### Backend API
The app connects to a backend API (default: `http://localhost:3002`):
```bash
# Set in .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

#### External APIs Used
- **Simplize API**: Historical price data and charts
- **VietCap API**: Technical analysis indicators (requires Referer: https://trading.vietcap.com.vn)
- **24hmoney API**: Foreign trading data
- **WordPress API**: News content from news.iqx.vn

#### Important API Requirements
- **VietCap APIs**: All requests to vietcap.com.vn domains require the `Referer: https://trading.vietcap.com.vn` header. This is automatically handled in `BaseApiService` for all fetch requests to VietCap endpoints.

### Data Flow Patterns

1. **Server-Side Rendering (SSR)**
   - News pages fetch data server-side for SEO
   - Company pages use SSR for initial data

2. **Client-Side Data Fetching**
   - Real-time stock prices use client-side polling
   - Interactive charts load data on demand

3. **Error Handling**
   - All services include retry logic with exponential backoff
   - Error boundaries for component-level error handling
   - Custom error pages for route-level errors

### Component Patterns

#### Business Components
Located in `src/components/business/`, these handle complex business logic:
- **StockDetailDialog**: Modal for detailed stock information
- **FinancialReport**: Financial statements display
- **ShareholdersAnalysis**: Ownership structure visualization
- **NewsSection**: News feed with filtering

#### Data Display Components
Located in `src/components/data-display/`:
- **VnindexChart**: Main market index chart
- **ForeignTradingChart**: Foreign investor activity
- **FinancialTable**: Sortable financial data tables
- **MarketOverview**: Market summary cards

### State Management
- No global state management library - uses React Server Components and hooks
- Server state cached via Next.js fetch caching
- Client state managed via hooks and component state

### Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **CSS Variables**: Theme customization via CSS custom properties
- **Dark Mode**: System-based theme switching with next-themes

### TradingView Integration
The app includes TradingView charting library integration:
- UDF datafeed adapter at `/api/tv/*` endpoints
- Custom datafeed implementation in `public/datafeeds/udf/`
- Chart container component at `src/components/TVChartContainer/`

### Performance Optimizations
- **Turbopack**: Fast bundling in development
- **React 19**: Automatic batching and transitions
- **Image Optimization**: Next.js Image component with CDN patterns
- **Code Splitting**: Automatic per-route code splitting
- **Font Optimization**: Manrope font with next/font

### Testing Approach
When using MCP Playwright (as specified in `.augment/rules/MVC.md`):
- Always use MCP Playwright for testing
- Focus on critical user paths
- Test API integrations with proper mocking

### Environment Variables
Required environment variables:
```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

### Common Development Tasks

#### Adding a New Stock Page Feature
1. Define types in `src/types/stock.ts`
2. Create service method in `src/services/stockService.ts`
3. Build custom hook in `src/hooks/`
4. Create component in `src/components/business/`
5. Integrate into page at `src/app/ma-chung-khoan/[ticker]/`

#### Adding API Endpoints
1. Create route handler in `src/app/api/`
2. Use NextRequest/NextResponse for type safety
3. Proxy to backend API to avoid CORS
4. Handle errors with consistent response format

#### Working with Financial Data
1. Use transformation service for data normalization
2. Apply formatters from `src/utils/formatters.ts`
3. Implement proper error states and loading skeletons
4. Cache responses appropriately

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Component files use PascalCase
- Hooks and utilities use camelCase
- Types/interfaces use PascalCase
- API routes follow REST conventions
