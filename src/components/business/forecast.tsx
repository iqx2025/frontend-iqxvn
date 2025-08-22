"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChartLine,
  TrendingDown,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
} from "lucide-react";
import { ForecastData, StatusType, ForecastOverviewProps } from "@/types/forecast";
import SentimentGaugeVNINDEX from "@/components/data-display/sentiment-gauge-vn-index";

const ForecastOverview: React.FC<ForecastOverviewProps> = ({
  data,
  className
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Default forecast data
  const defaultForecastData: ForecastData = {
    trend: "up",
    riskRatio: 33,
    macro: "neutral",
    momentum: "positive",
    technical: "positive",
    lastUpdated: "11/07/2025",
    confidence: 90,
  };

  const forecastData = data || defaultForecastData;

  const getTrendIcon = () => {
    return forecastData.trend === "up" ? (
      <TrendingUp className="size-5 text-green-500 dark:text-green-400" />
    ) : (
      <TrendingDown className="size-5 text-red-500 dark:text-red-400" />
    );
  };

  const getTrendColor = () => {
    return forecastData.trend === "up" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400";
  };

  return (
    <>
      <Card className={`relative overflow-hidden ${className}`}>
        {/* Compact Header */}
        <CardHeader className="pb-3 pt-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartLine className="size-5 text-primary" />
              <CardTitle className="text-lg font-bold">
                Dự báo thị trường
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm border-primary/20">
              {forecastData.lastUpdated}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Tuần này sẽ có nhiều biến động. Vui lòng cân nhắc kỹ lưỡng trước khi đầu tư.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 pb-4 pt-0">
          {/* Compact main trend and metrics layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main trend display - compact */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r from-background/50 to-muted/30 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                {getTrendIcon()}
                <span className={`text-2xl font-bold tracking-tight ${getTrendColor()}`}>
                  {forecastData.trend === "up" ? "TĂNG" : "GIẢM"}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Xu hướng
              </span>
              {/* Compact confidence indicator */}
              <div className="w-full mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Độ tin cậy</span>
                  <span className="font-bold">{forecastData.confidence}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${forecastData.trend === "up"
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                        }`}
                      style={{ width: `${forecastData.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact metrics grid */}
            <div className="lg:col-span-2">
              <SentimentGaugeVNINDEX />
            </div>
          </div>
        </CardContent>

        {/* Compact Footer */}
        <CardFooter className="relative z-10 bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm border-t border-border/50 py-3">
          <p className="text-sm">Cập nhật lần cuối: 22/08/2025</p>
        </CardFooter>

        {/* Subtle background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {forecastData.trend === "up" ? (
            <ArrowUpWideNarrow className="absolute top-1/2 right-4 -translate-y-1/2 h-1/2 w-auto text-primary/3 z-0" />
          ) : (
            <ArrowDownWideNarrow className="absolute top-1/2 right-4 -translate-y-1/2 h-1/2 w-auto text-primary/3 z-0 rotate-180" />
          )}
          <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-primary/3 to-transparent" />
        </div>
      </Card>
    </>
  );
};

export default ForecastOverview;