'use client';

/**
 * Advanced Search Page
 * Comprehensive search functionality for Vietnamese stocks
 */

import { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Building2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockSearch } from '@/components/forms/stock-search';
import { StockDetailDialog } from '@/components/business/stock-detail-dialog';
import { useAdvancedSearch, useCategorySearch } from '@/hooks';
import { Company } from '@/types';
import {
  formatNumber,
  formatPrice,
  formatPercentage,
  getPriceChangeBadgeVariant,
} from '@/utils';

export default function SearchPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState('quick');

  // Advanced search hook
  const {
    filters,
    updateFilters,
    clearFilters,
    results: searchResults,
    pagination,
    loading: searchLoading,
    error: searchError,
    search,
    goToPage,
  } = useAdvancedSearch();

  // Category search hook
  const {
    results: categoryResults,
    loading: categoryLoading,
    error: categoryError,
    searchByIndustry,
    searchBySector,
    searchByExchange,
  } = useCategorySearch();

  // Handle company selection
  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedCompany(null);
  };

  // Handle advanced search
  const handleAdvancedSearch = () => {
    search(1);
  };

  // Render company list
  const renderCompanyList = (companies: Company[], loading: boolean, error: string | null) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Lỗi: {error}</div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      );
    }

    if (companies.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không tìm thấy kết quả nào</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {companies.map((company) => (
          <Card 
            key={company.id} 
            className="cursor-pointer hover:shadow-md"
            onClick={() => handleCompanyClick(company)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {company.imageUrl && (
                    <Image
                      src={company.imageUrl}
                      alt={company.ticker}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{company.ticker}</span>
                      <Badge variant="outline">{company.stockExchange}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {company.nameVi}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {company.bcEconomicSectorName}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono font-bold text-lg mb-1">
                    {formatPrice(company.priceClose)}
                  </div>
                  <Badge
                    variant={getPriceChangeBadgeVariant(company.pctChange)}
                    className="mb-1"
                  >
                    {company.pctChange > 0 ? '+' : ''}{formatPercentage(company.pctChange)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Vol: {formatNumber(company.volume)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tìm kiếm chứng khoán
        </h1>
        <p className="text-muted-foreground">
          Tìm kiếm và khám phá thông tin chi tiết về các mã chứng khoán Việt Nam
        </p>
      </div>

      {/* Search Tabs */}
      <Tabs value={activeSearchTab} onValueChange={setActiveSearchTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Tìm kiếm nhanh
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Tìm kiếm nâng cao
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Theo danh mục
          </TabsTrigger>
        </TabsList>

        {/* Quick Search */}
        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Tìm kiếm nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StockSearch
                onCompanySelect={handleCompanyClick}
                placeholder="Nhập mã chứng khoán hoặc tên công ty..."
                className="max-w-2xl"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Gõ để tìm kiếm theo mã chứng khoán, tên công ty hoặc ngành nghề
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Search */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Tìm kiếm nâng cao
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Từ khóa</label>
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Sàn giao dịch</label>
                  <select
                    value={filters.exchange}
                    onChange={(e) => updateFilters({ exchange: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Tất cả</option>
                    <option value="HOSE">HOSE</option>
                    <option value="HNX">HNX</option>
                    <option value="UPCOM">UPCOM</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sắp xếp theo</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Mặc định</option>
                    <option value="market_cap">Vốn hóa</option>
                    <option value="price_close">Giá</option>
                    <option value="pct_change">% Thay đổi</option>
                    <option value="volume">Khối lượng</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdvancedSearch} disabled={searchLoading}>
                  {searchLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Search Results */}
          {(searchResults.length > 0 || searchLoading || searchError) && (
            <Card>
              <CardHeader>
                <CardTitle>Kết quả tìm kiếm</CardTitle>
                {pagination.total > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Tìm thấy {pagination.total} kết quả
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {renderCompanyList(searchResults, searchLoading, searchError)}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => goToPage(pagination.page - 1)}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => goToPage(pagination.page + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Category Search */}
        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search by Exchange */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theo sàn giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByExchange('HOSE')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  HOSE
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByExchange('HNX')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  HNX
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByExchange('UPCOM')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  UPCOM
                </Button>
              </CardContent>
            </Card>

            {/* Popular Sectors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lĩnh vực phổ biến</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchBySector('tai-chinh')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Tài chính
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchBySector('bat-dong-san')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Bất động sản
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchBySector('cong-nghiep')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Công nghiệp
                </Button>
              </CardContent>
            </Card>

            {/* Popular Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ngành nghề phổ biến</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByIndustry('ngan-hang')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Ngân hàng
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByIndustry('chung-khoan')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Chứng khoán
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => searchByIndustry('xay-dung')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Xây dựng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Category Search Results */}
          {(categoryResults.length > 0 || categoryLoading || categoryError) && (
            <Card>
              <CardHeader>
                <CardTitle>Kết quả theo danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCompanyList(categoryResults, categoryLoading, categoryError)}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Stock Detail Dialog */}
      <StockDetailDialog
        company={selectedCompany}
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </div>
  );
}
