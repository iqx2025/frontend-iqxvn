"use client";

import React, { useState } from 'react';
import { FinancialPeriodType, FinancialStatementSection } from '@/types/financial';
import { useFinancialSectionData } from '@/hooks/useFinancialData';
import FinancialTable from '@/components/data-display/financial-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialTableWithPeriodToggleProps {
  ticker: string;
  section: FinancialStatementSection;
  title: string;
  className?: string;
}

const FinancialTableWithPeriodToggle: React.FC<FinancialTableWithPeriodToggleProps> = ({
  ticker,
  section,
  title,
  className
}) => {
  const [periodType, setPeriodType] = useState<FinancialPeriodType>('annual');
  const { data, loading, error } = useFinancialSectionData(ticker, section, periodType);

  const handlePeriodTypeChange = (newType: FinancialPeriodType) => {
    setPeriodType(newType);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Period toggle skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            {/* Table header skeleton */}
            <div className="grid grid-cols-7 gap-4 p-3 bg-muted/30 rounded">
              <Skeleton className="h-4 w-32" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
              <Skeleton className="h-4 w-20" />
            </div>
            
            {/* Table rows skeleton */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-7 gap-4 p-3 border-b">
                <Skeleton className="h-4 w-40" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-4 w-16" />
                ))}
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>{error || 'Không có dữ liệu cho phần này'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FinancialTable
      section={data}
      title={title}
      className={className}
      periodType={periodType}
      onPeriodTypeChange={handlePeriodTypeChange}
    />
  );
};

export default FinancialTableWithPeriodToggle;
