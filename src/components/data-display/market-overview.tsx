import { Building2, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, safeGet } from '@/utils/formatters';

interface MarketStats {
  totalCompanies: string;
  totalIndustries: number;
  totalSectors: number;
  exchanges: Array<{
    exchange: string;
    count: string;
  }>;
  topIndustries: Array<{
    slug: string;
    name: string;
    count: string;
  }>;
  topSectors: Array<{
    slug: string;
    name: string;
    count: string;
  }>;
}

interface MarketOverviewProps {
  stats: MarketStats | null;
  loading?: boolean;
}

export function MarketOverview({ stats, loading = false }: MarketOverviewProps) {
  // Handle loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Handle null/undefined stats
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không thể tải dữ liệu thống kê</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const totalCompanies = safeGet(stats, 'totalCompanies', '0');
  const totalIndustries = safeGet(stats, 'totalIndustries', 0);
  const totalSectors = safeGet(stats, 'totalSectors', 0);
  const exchanges = safeGet(stats, 'exchanges', [] as Array<{exchange: string; count: string}>);



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Companies */}
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 dark:border-l-blue-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Tổng số mã
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatNumber(totalCompanies)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Đang giao dịch
          </p>
        </CardContent>
      </Card>

      {/* Total Industries */}
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 dark:border-l-green-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
              <PieChart className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Ngành nghề
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatNumber(totalIndustries)}
          </div>
          <p className="text-xs text-muted-foreground">
            Phân loại ngành
          </p>
        </CardContent>
      </Card>

      {/* Total Sectors */}
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 dark:border-l-purple-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Lĩnh vực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatNumber(totalSectors)}
          </div>
          <p className="text-xs text-muted-foreground">
            Phân loại lĩnh vực
          </p>
        </CardContent>
      </Card>

      {/* Exchanges */}
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 dark:border-l-orange-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            Sàn giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-2">
            {exchanges.length}
          </div>
          <div className="space-y-1">
            {exchanges.map((exchange, index) => (
              <div
                key={exchange.exchange || index}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-muted-foreground font-medium">
                  {exchange.exchange || 'N/A'}:
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {formatNumber(exchange.count)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
