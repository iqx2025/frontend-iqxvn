'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Volume2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketOverview } from '@/components/data-display/market-overview';
import { StockFilters } from '@/components/forms/stock-filters';
import { StockDetailDialog } from '@/components/business/stock-detail-dialog';
import {
  formatNumber,
  formatPrice,
  formatPercentage,
  getPriceChangeColor,
  getPriceChangeBadgeVariant,
} from '@/utils';

// Import types from the new types file
import { Company } from '@/types';

// Import custom hooks
import { useStockData, useStockManagement } from '@/hooks';

export default function StocksPage() {
  // Use the new custom hooks for data fetching and state management
  const {
    companies,
    marketStats,
    topLists,
    loading,
    error,
    retryCount,
    retry,
  } = useStockData(100, 10);

  // Use the stock management hook for filtering, pagination, and tabs
  const {
    searchTerm,
    setSearchTerm,
    selectedExchange,
    setSelectedExchange,
    selectedSector,
    setSelectedSector,
    filteredCompanies,
    exchanges,
    sectors,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    activeTab,
    setActiveTab,
    displayData,
  } = useStockManagement(companies, topLists, 20);

  // Dialog state for company details
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Event handlers
  const handleRetry = () => {
    retry();
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mã chứng khoán
          </h1>
          <p className="text-muted-foreground">
            Tìm kiếm và theo dõi mã chứng khoán Việt Nam
          </p>
        </div>

        {/* Loading State */}
        <div className="space-y-6">
          {/* Market Overview Loading */}
          <MarketOverview stats={null} loading={true} />

          {/* Filters Loading */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-10 bg-muted rounded-md"></div>
            <div className="flex gap-2">
              <div className="w-32 h-10 bg-muted rounded-md"></div>
              <div className="w-32 h-10 bg-muted rounded-md"></div>
            </div>
          </div>

          {/* Tabs Loading */}
          <div className="flex gap-2 border-b">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-24 h-10 bg-muted rounded-t-md"></div>
            ))}
          </div>

          {/* Table Loading */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                    <div className="w-20 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mã chứng khoán
          </h1>
          <p className="text-muted-foreground">
            Tìm kiếm và theo dõi mã chứng khoán Việt Nam
          </p>
        </div>

        {/* Error State */}
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {error}
            </p>
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Đang thử lại... (lần {retryCount}/3)
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mã chứng khoán
        </h1>
        <p className="text-muted-foreground">
          Tìm kiếm và theo dõi mã chứng khoán Việt Nam
        </p>
      </div>

      {/* Market Overview Stats */}
      <div className="mb-8">
        <MarketOverview stats={marketStats} loading={loading} />
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <StockFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedExchange={selectedExchange}
          onExchangeChange={setSelectedExchange}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          exchanges={exchanges}
          sectors={sectors}
          onCompanySelect={handleCompanyClick}
          useAdvancedSearch={true}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('all')}
          className="rounded-lg"
          size="sm"
        >
          Tất cả ({filteredCompanies.length})
        </Button>
        <Button
          variant={activeTab === 'gainers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('gainers')}
          className="rounded-lg flex items-center gap-2"
          size="sm"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Top tăng giá</span>
          <span className="sm:hidden">Tăng</span>
        </Button>
        <Button
          variant={activeTab === 'losers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('losers')}
          className="rounded-lg flex items-center gap-2"
          size="sm"
        >
          <TrendingDown className="h-4 w-4" />
          <span className="hidden sm:inline">Top giảm giá</span>
          <span className="sm:hidden">Giảm</span>
        </Button>
        <Button
          variant={activeTab === 'volume' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('volume')}
          className="rounded-lg flex items-center gap-2"
          size="sm"
        >
          <Volume2 className="h-4 w-4" />
          <span className="hidden sm:inline">Top khối lượng</span>
          <span className="sm:hidden">KL</span>
        </Button>
      </div>

      {/* Stocks Table */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gradient-to-r from-muted/30 to-muted/50 backdrop-blur-sm">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground/80 sticky left-0 bg-inherit">
                    Mã CK
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground/80 min-w-[200px]">
                    Tên công ty
                  </th>
                  <th className="text-right p-4 font-semibold text-foreground/80 min-w-[100px]">
                    Giá
                  </th>
                  <th className="text-right p-4 font-semibold text-foreground/80 min-w-[100px] hidden sm:table-cell">
                    Thay đổi
                  </th>
                  <th className="text-right p-4 font-semibold text-foreground/80 min-w-[80px]">
                    %
                  </th>
                  <th className="text-right p-4 font-semibold text-foreground/80 min-w-[100px] hidden md:table-cell">
                    Khối lượng
                  </th>
                  <th className="text-right p-4 font-semibold text-foreground/80 min-w-[100px] hidden lg:table-cell">
                    Vốn hóa
                  </th>
                  <th className="text-center p-4 font-semibold text-foreground/80 min-w-[80px] hidden sm:table-cell">
                    Sàn
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((company: Company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border/50 hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 cursor-pointer group"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <td className="p-4 sticky left-0 bg-inherit group-hover:bg-inherit">
                      <div className="flex items-center gap-3">
                        {company.imageUrl && (
                          <div className="relative">
                            <Image
                              src={company.imageUrl}
                              alt={company.ticker}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border-2 border-border/20 group-hover:border-primary/30"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/10"></div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary">
                            {company.ticker}
                          </div>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {company.bcEconomicSectorName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <div className="font-medium truncate text-foreground group-hover:text-primary">
                          {company.nameVi}
                        </div>
                        <div className="text-sm text-muted-foreground truncate hidden sm:block">
                          {company.bcEconomicSectorName}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-mono font-semibold text-lg">
                        {formatPrice(company.priceClose)}
                      </div>
                    </td>
                    <td className={`p-4 text-right font-mono font-medium hidden sm:table-cell ${getPriceChangeColor(company.netChange)}`}>
                      {company.netChange > 0 ? '+' : ''}{formatPrice(company.netChange)}
                    </td>
                    <td className="p-4 text-right">
                      <Badge
                        variant={getPriceChangeBadgeVariant(company.pctChange)}
                        className="font-semibold"
                      >
                        {company.pctChange > 0 ? '+' : ''}{formatPercentage(company.pctChange)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-muted-foreground hidden md:table-cell">
                      {formatNumber(company.volume)}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-muted-foreground hidden lg:table-cell">
                      {formatNumber(company.marketCap)}
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium border-primary/20 text-primary/80 group-hover:border-primary/40"
                      >
                        {company.stockExchange}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination - only show for 'all' tab */}
      {activeTab === 'all' && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)}
            trong tổng số {filteredCompanies.length} kết quả
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {displayData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            Không tìm thấy kết quả nào
          </div>
        </div>
      )}

      {/* Stock Detail Dialog */}
      <StockDetailDialog
        company={selectedCompany}
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </div>
  );
}