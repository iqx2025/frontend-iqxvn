import type {
  MarketSentimentPayload,
  MoneyFlowItem,
  SectorBreadthItem,
  PriceChangeBin,
  SentimentHistoryPoint
} from '@/types/market-sentiment';

/**
 * Generate realistic mock market sentiment data
 */
export async function getMockMarketSentiment(): Promise<MarketSentimentPayload> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  // Generate random sentiment value (weighted towards neutral/optimistic)
  const sentimentPercent = Math.round(35 + Math.random() * 40 + (Math.random() > 0.5 ? Math.random() * 10 : 0));

  // Generate money flow data (in trillion VND)
  const totalFlow = 15 + Math.random() * 10;
  const upPercent = 0.3 + Math.random() * 0.4;
  const downPercent = 0.3 + Math.random() * 0.3;
  const unchangedPercent = 1 - upPercent - downPercent;

  const moneyFlow: MoneyFlowItem[] = [
    {
      label: 'Tăng',
      value: Number((totalFlow * upPercent).toFixed(2)),
      color: '#22c55e'
    },
    {
      label: 'Giảm',
      value: Number((totalFlow * downPercent).toFixed(2)),
      color: '#ef4444'
    },
    {
      label: 'Không đổi',
      value: Number((totalFlow * unchangedPercent).toFixed(2)),
      color: '#eab308'
    }
  ];

  // Generate sector breadth data with standard GICS sectors
  const sectors = [
    'Tiêu dùng không thiết yếu',
    'Nguyên vật liệu',
    'Năng lượng',
    'Tiêu dùng thiết yếu',
    'Tài chính',
    'Bất động sản',
    'Dịch vụ truyền thông',
    'Công nghiệp',
    'Chăm sóc sức khỏe',
    'Tiện ích',
    'Công nghệ thông tin'
  ];

  const breadth: SectorBreadthItem[] = sectors.map(sector => {
    // Generate values with higher probability near center, occasional extremes
    const random = Math.random();
    let pct: number;
    
    if (random < 0.1) {
      // 10% chance of extreme values (-7% to -5% or 5% to 7%)
      pct = Math.random() > 0.5 
        ? Number((5 + Math.random() * 2).toFixed(2))
        : Number((-7 + Math.random() * 2).toFixed(2));
    } else if (random < 0.3) {
      // 20% chance of moderate values (-5% to -3% or 3% to 5%)
      pct = Math.random() > 0.5
        ? Number((3 + Math.random() * 2).toFixed(2))
        : Number((-5 + Math.random() * 2).toFixed(2));
    } else {
      // 70% chance of normal values (-3% to 3%)
      pct = Number((Math.random() * 6 - 3).toFixed(2));
    }
    
    return {
      sector,
      pct,
      count: Math.floor(10 + Math.random() * 40)
    };
  }).sort((a, b) => b.pct - a.pct); // Sort by performance

  // Generate price change distribution
  const distributionRanges = [
    { range: '≤ -7%', rangeStart: -100, rangeEnd: -7 },
    { range: '-7% → -5%', rangeStart: -7, rangeEnd: -5 },
    { range: '-5% → -3%', rangeStart: -5, rangeEnd: -3 },
    { range: '-3% → -1%', rangeStart: -3, rangeEnd: -1 },
    { range: '-1% → 0%', rangeStart: -1, rangeEnd: 0 },
    { range: '0%', rangeStart: 0, rangeEnd: 0 },
    { range: '0% → 1%', rangeStart: 0, rangeEnd: 1 },
    { range: '1% → 3%', rangeStart: 1, rangeEnd: 3 },
    { range: '3% → 5%', rangeStart: 3, rangeEnd: 5 },
    { range: '5% → 7%', rangeStart: 5, rangeEnd: 7 },
    { range: '≥ 7%', rangeStart: 7, rangeEnd: 100 }
  ];

  // Generate normally distributed stock counts
  const distribution: PriceChangeBin[] = distributionRanges.map((item, index) => {
    const centerIndex = 5; // Center around 0%
    const distance = Math.abs(index - centerIndex);
    const baseCount = 100;
    const count = Math.floor(baseCount * Math.exp(-distance * 0.3) + Math.random() * 20);
    
    return {
      ...item,
      count
    };
  });

  // Generate historical sentiment data (last 30 days)
  const history: SentimentHistoryPoint[] = [];
  const now = new Date();
  let currentValue = 50;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * 8;
    const meanReversion = (55 - currentValue) * 0.1;
    currentValue = Math.max(20, Math.min(80, currentValue + change + meanReversion));
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue),
      volume: Math.floor(1000 + Math.random() * 2000)
    });
  }

  // Set the last value to match the gauge
  if (history.length > 0) {
    history[history.length - 1].value = sentimentPercent;
  }

  return {
    gauge: {
      percent: sentimentPercent,
      updatedAt: new Date().toISOString()
    },
    moneyFlow,
    breadth,
    distribution,
    history,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate mock real-time sentiment updates
 */
export function* generateSentimentUpdates(initial: number = 50): Generator<number> {
  let current = initial;
  
  while (true) {
    // Small random changes with mean reversion
    const change = (Math.random() - 0.5) * 3;
    const meanReversion = (55 - current) * 0.05;
    current = Math.max(0, Math.min(100, current + change + meanReversion));
    
    yield Math.round(current);
  }
}
