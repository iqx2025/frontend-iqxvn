/**
 * Financial Data Types and Interfaces
 * Defines TypeScript interfaces for VietCap financial statement data
 */

// Base API Response Structure
export interface VietCapApiResponse<T> {
  serverDateTime: string;
  status: number;
  code: number;
  msg: string;
  exception: string | null;
  successful: boolean;
  data: T;
}

// Financial Metrics Metadata Structure
export interface FinancialMetricItem {
  level: number;
  parent: string | null;
  titleEn: string;
  titleVi: string;
  fullTitleVi: string;
  fullTitleEn: string;
  field: string | null;
  name: string;
}

export interface FinancialMetricsData {
  BALANCE_SHEET: FinancialMetricItem[];
  INCOME_STATEMENT: FinancialMetricItem[];
  CASH_FLOW: FinancialMetricItem[];
  NOTE: FinancialMetricItem[];
}

// Financial Statement Data Structure
export interface FinancialStatementRecord {
  organCode: string;
  ticker: string;
  createDate: string;
  updateDate: string;
  yearReport: number;
  lengthReport: number; // 1=Q1, 2=Q2, 3=Q3, 4=Q4, 5=Annual
  publicDate: string;
  
  // Income Statement Fields
  isa1?: number;
  isa2?: number;
  isa3?: number;
  isa4?: number;
  isa5?: number;
  isa6?: number;
  isa7?: number;
  isa8?: number;
  isa9?: number;
  isa10?: number;
  isa11?: number;
  isa12?: number;
  isa13?: number;
  isa14?: number;
  isa15?: number;
  isa16?: number; // Net Accounting Profit/(loss) before tax
  isa17?: number; // Business income tax - current
  isa18?: number; // Business income tax - deferred
  isa19?: number; // Business income tax expenses
  isa20?: number; // Net profit/(loss) after tax
  isa21?: number; // Minority interest
  isa22?: number; // Attributable to parent company
  isa23?: number; // EPS basic (VND)
  isa24?: number; // EPS diluted (VND)
  
  // Income Statement Banking Fields
  isb25?: number; // Interest and Similar Income
  isb26?: number; // Interest and Similar Expenses
  isb27?: number; // Net Interest Income
  isb28?: number; // Fees and Commission Income
  isb29?: number; // Fees and Commission Expenses
  isb30?: number; // Net Fee and Commission Income
  isb31?: number; // Net gain/(loss) from foreign currency and gold dealings
  isb32?: number; // Net gain/(loss) from trading of trading securities
  isb33?: number; // Net gain/(loss) from disposal of investment securities
  isb34?: number; // Other Income
  isb35?: number; // Other Expenses
  isb36?: number; // Net Other income/expenses
  isb37?: number; // Dividends Income
  isb38?: number; // Total Operating Income
  isb39?: number; // General and Admin Expenses
  isb40?: number; // Net Operating Profit Before Allowance for Credit Loss
  isb41?: number; // Provision for Credit Losses
  
  // Additional Income Statement Fields (iss, isi)
  [key: string]: string | number | null | undefined; // For dynamic field access
}

export interface FinancialStatementData {
  years: FinancialStatementRecord[];
  quarters: FinancialStatementRecord[];
}

// Processed Financial Data for Display
export interface ProcessedFinancialItem {
  field: string;
  name: string;
  titleVi: string;
  titleEn: string;
  level: number;
  parent: string | null;
  values: {
    [period: string]: number | null;
  };
  latestValue: number | null;
  previousValue: number | null;
  change: number | null;
  changePercent: number | null;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

export interface ProcessedFinancialSection {
  sectionName: string;
  sectionTitle: string;
  items: ProcessedFinancialItem[];
  periods: string[];
  periodType: FinancialPeriodType;
  availableYears: number[];
  availableQuarters: { year: number; quarter: number; period: string }[];
}

// Financial Report Data Structure
export interface FinancialReportData {
  ticker: string;
  lastUpdated: string;
  sections: {
    incomeStatement: ProcessedFinancialSection;
    balanceSheet: ProcessedFinancialSection;
    cashFlow: ProcessedFinancialSection;
    notes: ProcessedFinancialSection;
  };
  metrics: FinancialMetricsData;
}

// API Service Types
export type FinancialStatementSection = 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW' | 'NOTE';

export interface FinancialDataFetchOptions {
  ticker: string;
  section?: FinancialStatementSection;
  useCache?: boolean;
  maxRetries?: number;
}

// Error Types
export interface FinancialDataError {
  code: string;
  message: string;
  section?: FinancialStatementSection;
  ticker?: string;
  originalError?: Error;
}

// Hook Return Types
export interface UseFinancialDataReturn {
  data: FinancialReportData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

// Component Props Types
export interface FinancialReportProps {
  ticker: string;
  className?: string;
}

export interface FinancialSectionProps {
  section: ProcessedFinancialSection;
  loading?: boolean;
  className?: string;
}

export interface FinancialTableProps {
  section: ProcessedFinancialSection;
  title: string;
  loading?: boolean;
  className?: string;
  periodType?: FinancialPeriodType;
  onPeriodTypeChange?: (type: FinancialPeriodType) => void;
}

// Utility Types
export type FinancialPeriodType = 'annual' | 'quarterly';
export type FinancialDisplayFormat = 'absolute' | 'percentage' | 'currency';

export interface FinancialFormatOptions {
  format: FinancialDisplayFormat;
  decimals?: number;
  showChange?: boolean;
  showPercentChange?: boolean;
  highlightChanges?: boolean;
}
