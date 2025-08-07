import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  formatNumber,
  formatPrice,
  getPriceChangeColor,
  getPriceChangeBadgeVariant
} from '@/utils';
import { Company } from '@/types';

interface StockCardProps {
  company: Company;
  onClick?: () => void;
}

export function StockCard({ company, onClick }: StockCardProps) {

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {company.imageUrl && (
              <Image
                src={company.imageUrl}
                alt={company.ticker}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="font-bold text-lg">{company.ticker}</div>
              <Badge variant="outline" className="text-xs">
                {company.stockExchange}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-semibold">
              {formatPrice(company.priceClose)}
            </div>
            <div className={`text-sm font-mono ${getPriceChangeColor(company.netChange)}`}>
              {company.netChange > 0 ? '+' : ''}{formatPrice(company.netChange)}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="font-medium text-sm truncate mb-1">{company.nameVi}</div>
          <div className="text-xs text-muted-foreground truncate">
            {company.bcEconomicSectorName}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={getPriceChangeBadgeVariant(company.pctChange)}>
            {company.pctChange > 0 ? '+' : ''}{company.pctChange.toFixed(2)}%
          </Badge>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Khối lượng</div>
            <div className="text-sm font-mono">{formatNumber(company.volume)}</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Vốn hóa:</span>
            <span className="font-mono">{formatNumber(company.marketCap)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">P/E:</span>
            <span className="font-mono">{company.peRatio?.toFixed(2) || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
