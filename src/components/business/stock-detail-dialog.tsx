'use client';

import Image from 'next/image';
import { Building2, Globe, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  formatNumber,
  formatPrice,
  formatPercentage,
  getPriceChangeColor,
  getPriceChangeBadgeVariant,
  formatDate,
  stripHtml
} from '@/utils';

interface Company {
  id: number;
  ticker: string;
  nameVi: string;
  nameEn: string;
  stockExchange: string;
  priceClose: number;
  netChange: number;
  pctChange: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  pbRatio: number;
  bcIndustryGroupSlug: string;
  bcEconomicSectorSlug: string;
  bcEconomicSectorName: string;
  imageUrl: string;
  website?: string;
  mainService?: string;
  businessLine?: string;
  businessStrategy?: string;
  businessRisk?: string;
  analysisUpdated?: string;
  roe?: number;
  roa?: number;
  dividendYieldCurrent?: number;
  beta5y?: number;
  pricePctChg1y?: number;
  pricePctChg3y?: number;
  pricePctChg5y?: number;
}

interface StockDetailDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockDetailDialog({ company, isOpen, onClose }: StockDetailDialogProps) {
  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {company.imageUrl && (
              <Image
                src={company.imageUrl}
                alt={company.ticker}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="text-2xl font-bold">{company.ticker}</div>
              <div className="text-sm text-muted-foreground">{company.nameVi}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin giá</span>
                <Badge variant="outline">{company.stockExchange}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold font-mono">
                  {formatPrice(company.priceClose)}
                </span>
                <div className="text-right">
                  <div className={`font-mono ${getPriceChangeColor(company.netChange)}`}>
                    {company.netChange > 0 ? '+' : ''}{formatPrice(company.netChange)}
                  </div>
                  <Badge variant={getPriceChangeBadgeVariant(company.pctChange)}>
                    {company.pctChange > 0 ? '+' : ''}{formatPercentage(company.pctChange)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Khối lượng:</span>
                  <div className="font-mono">{formatNumber(company.volume)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Vốn hóa:</span>
                  <div className="font-mono">{formatNumber(company.marketCap)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">P/E:</span>
                  <div className="font-mono">{company.peRatio?.toFixed(2) || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">P/B:</span>
                  <div className="font-mono">{company.pbRatio?.toFixed(2) || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số tài chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ROE:</span>
                  <div className="font-mono">{formatPercentage(company.roe)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">ROA:</span>
                  <div className="font-mono">{formatPercentage(company.roa)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tỷ suất cổ tức:</span>
                  <div className="font-mono">{formatPercentage(company.dividendYieldCurrent)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Beta 5Y:</span>
                  <div className="font-mono">{company.beta5y?.toFixed(2) || 'N/A'}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Hiệu suất theo thời gian:</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">1 năm:</span>
                    <div className={`font-mono ${getPriceChangeColor(company.pricePctChg1y)}`}>
                      {formatPercentage(company.pricePctChg1y)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">3 năm:</span>
                    <div className={`font-mono ${getPriceChangeColor(company.pricePctChg3y)}`}>
                      {formatPercentage(company.pricePctChg3y)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">5 năm:</span>
                    <div className={`font-mono ${getPriceChangeColor(company.pricePctChg5y)}`}>
                      {formatPercentage(company.pricePctChg5y)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Thông tin công ty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Tên tiếng Anh:</span>
                  <div className="font-medium">{company.nameEn}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Lĩnh vực:</span>
                  <div className="font-medium">{company.bcEconomicSectorName}</div>
                </div>
                {company.website && (
                  <div>
                    <span className="text-sm text-muted-foreground">Website:</span>
                    <div>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Cập nhật phân tích:</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(company.analysisUpdated)}
                  </div>
                </div>
              </div>

              {company.mainService && (
                <div>
                  <span className="text-sm text-muted-foreground font-medium">Dịch vụ chính:</span>
                  <div className="mt-1 text-sm">{stripHtml(company.mainService)}</div>
                </div>
              )}

              {company.businessLine && (
                <div>
                  <span className="text-sm text-muted-foreground font-medium">Ngành nghề kinh doanh:</span>
                  <div className="mt-1 text-sm">{stripHtml(company.businessLine)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
