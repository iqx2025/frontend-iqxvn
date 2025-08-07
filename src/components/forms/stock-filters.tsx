import { Filter, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { StockSearch, SimpleStockSearch } from '@/components/forms/stock-search';
import { Company } from '@/types/stock';

interface Sector {
  slug: string;
  name: string;
}

interface StockFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedExchange: string;
  onExchangeChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  exchanges: string[];
  sectors: Sector[];
  onCompanySelect?: (company: Company) => void;
  useAdvancedSearch?: boolean;
}

export function StockFilters({
  searchTerm,
  onSearchChange,
  selectedExchange,
  onExchangeChange,
  selectedSector,
  onSectorChange,
  exchanges,
  sectors,
  onCompanySelect,
  useAdvancedSearch = false
}: StockFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        {useAdvancedSearch ? (
          <StockSearch
            onCompanySelect={onCompanySelect}
            onSearchChange={onSearchChange}
            placeholder="Tìm kiếm theo mã, tên công ty..."
          />
        ) : (
          <SimpleStockSearch
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Tìm kiếm theo mã, tên công ty..."
          />
        )}
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Sàn: {selectedExchange === 'all' ? 'Tất cả' : selectedExchange}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExchangeChange('all')}>
              Tất cả
            </DropdownMenuItem>
            {exchanges.map(exchange => (
              <DropdownMenuItem 
                key={exchange} 
                onClick={() => onExchangeChange(exchange)}
              >
                {exchange}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Ngành: {selectedSector === 'all' ? 'Tất cả' : 
                sectors.find(s => s.slug === selectedSector)?.name || 'Tất cả'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto">
            <DropdownMenuItem onClick={() => onSectorChange('all')}>
              Tất cả
            </DropdownMenuItem>
            {sectors.map(sector => (
              <DropdownMenuItem 
                key={sector.slug} 
                onClick={() => onSectorChange(sector.slug)}
              >
                {sector.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
