/**
 * Forecast-related TypeScript types and interfaces
 */

export type TrendDirection = "up" | "down";

export type StatusType = "positive" | "negative" | "neutral";

export type ImpactType = "high" | "medium" | "low";

export interface ForecastData {
  trend: TrendDirection;
  riskRatio: number;
  macro: StatusType;
  momentum: StatusType;
  technical: StatusType;
  lastUpdated: string;
  confidence: number;
}

export interface ForecastMetric {
  label: string;
  value: string | number;
  status: StatusType;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DetailedForecastData extends ForecastData {
  analysis: {
    summary: string;
    keyFactors: string[];
    risks: string[];
    opportunities: string[];
  };
  metrics: {
    riskRatio: ForecastMetric;
    macro: ForecastMetric;
    momentum: ForecastMetric;
    technical: ForecastMetric;
  };
  recommendations: {
    shortTerm: string[];
    longTerm: string[];
  };
  marketConditions: {
    volatility: number;
    volume: string;
    sentiment: StatusType;
  };
}

export interface ForecastOverviewProps {
  className?: string;
}

export interface ForecastDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DetailedForecastData;
}
