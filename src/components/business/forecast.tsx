"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpWideNarrow,
  ChartLine,
  InfoIcon,
  TrendingDown,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
} from "lucide-react";
import { ForecastData, DetailedForecastData, StatusType, ForecastOverviewProps } from "@/types/forecast";
import ForecastDetailDialog from "./forecast-detail-dialog";

const ForecastOverview: React.FC<ForecastOverviewProps> = ({
  data,
  className,
  onViewDetails
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

  // Detailed forecast data for the dialog
  const detailedForecastData: DetailedForecastData = {
    ...forecastData,
    analysis: {
      summary: "Thị trường đang cho thấy những tín hiệu tích cực với xu hướng tăng trưởng ổn định. Các chỉ số kỹ thuật và động lượng đều hỗ trợ cho xu hướng này, tuy nhiên vẫn cần theo dõi các yếu tố vĩ mô.",
      keyFactors: [
        "Thanh khoản thị trường cải thiện đáng kể",
        "Dòng tiền ngoại tiếp tục đổ vào thị trường",
        "Các chỉ số kinh tế vĩ mô cho tín hiệu tích cực",
        "Tâm lý nhà đầu tư được cải thiện"
      ],
      risks: [
        "Biến động từ thị trường quốc tế",
        "Áp lực bán từ nhà đầu tư ngắn hạn",
        "Rủi ro thanh khoản tại một số mã cổ phiếu",
        "Tác động từ chính sách tiền tệ"
      ],
      opportunities: [
        "Cơ hội đầu tư vào các cổ phiếu có fundamentals tốt",
        "Xu hướng tăng trưởng dài hạn của thị trường",
        "Cải thiện trong báo cáo tài chính doanh nghiệp",
        "Hỗ trợ từ chính sách kinh tế vĩ mô"
      ]
    },
    metrics: {
      riskRatio: {
        label: "Tỉ lệ rủi ro",
        value: `${forecastData.riskRatio}%`,
        status: "positive",
        description: "Tỉ lệ rủi ro thấp cho thấy thị trường đang ở trạng thái ổn định"
      },
      macro: {
        label: "Vĩ mô",
        value: forecastData.macro === "positive" ? "Khả quan" : forecastData.macro === "negative" ? "Kém khả quan" : "Trung tính",
        status: forecastData.macro,
        description: "Các yếu tố kinh tế vĩ mô đang ở mức trung tính, cần theo dõi thêm"
      },
      momentum: {
        label: "Động lượng",
        value: forecastData.momentum === "positive" ? "Khả quan" : forecastData.momentum === "negative" ? "Kém khả quan" : "Trung tính",
        status: forecastData.momentum,
        description: "Động lượng thị trường tích cực với xu hướng tăng trưởng bền vững"
      },
      technical: {
        label: "Kỹ thuật",
        value: forecastData.technical === "positive" ? "Khả quan" : forecastData.technical === "negative" ? "Kém khả quan" : "Trung tính",
        status: forecastData.technical,
        description: "Các chỉ báo kỹ thuật cho tín hiệu tích cực cho xu hướng tăng"
      }
    },
    recommendations: {
      shortTerm: [
        "Tăng tỷ trọng cổ phiếu trong danh mục đầu tư",
        "Tập trung vào các cổ phiếu có thanh khoản tốt",
        "Theo dõi sát các tin tức thị trường",
        "Đặt lệnh stop-loss để bảo vệ vốn"
      ],
      longTerm: [
        "Xây dựng danh mục đầu tư cân bằng",
        "Đầu tư định kỳ để tận dụng cost averaging",
        "Tập trung vào các doanh nghiệp có fundamentals mạnh",
        "Duy trì tỷ lệ tiền mặt hợp lý"
      ]
    },
    marketConditions: {
      volatility: 15.2,
      volume: "Cao",
      sentiment: "positive"
    }
  };

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

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "positive": return "text-green-500 dark:text-green-400";
      case "negative": return "text-red-500 dark:text-red-400";
      case "neutral": return "text-orange-500 dark:text-orange-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "positive": return <Activity className="size-3 text-green-500 dark:text-green-400" />;
      case "negative": return <BarChart3 className="size-3 text-red-500 dark:text-red-400" />;
      case "neutral": return <Target className="size-3 text-orange-500 dark:text-orange-400" />;
      default: return <Activity className="size-3 text-gray-500 dark:text-gray-400" />;
    }
  };

  const handleViewDetails = () => {
    setIsDetailDialogOpen(true);
    onViewDetails?.(detailedForecastData);
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
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        forecastData.trend === "up"
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
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <div className="group p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-1 justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Rủi ro</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-3 opacity-60 hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Tỉ lệ rủi ro của thị trường trong tuần này.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon("positive")}
                  <span className="font-bold text-green-500 text-lg">{forecastData.riskRatio}%</span>
                </div>
              </div>

              <div className="group p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-1 justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Vĩ mô</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-3 opacity-60 hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Đánh giá các yếu tố kinh tế vĩ mô ảnh hưởng đến thị trường.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(forecastData.macro)}
                  <span className={`font-bold ${getStatusColor(forecastData.macro)} text-sm`}>
                    {forecastData.macro === "positive" ? "Khả quan" :
                      forecastData.macro === "negative" ? "Kém khả quan" : "Trung tính"}
                  </span>
                </div>
              </div>

              <div className="group p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-1 justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Động lượng</span>
                  <Tooltip >
                    <TooltipTrigger>
                      <InfoIcon className="size-3 opacity-60 hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Đánh giá về động lượng hiện tại của thị trường và khả năng duy trì xu hướng.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(forecastData.momentum)}
                  <span className={`font-bold ${getStatusColor(forecastData.momentum)} text-sm`}>
                    {forecastData.momentum === "positive" ? "Khả quan" :
                      forecastData.momentum === "negative" ? "Kém khả quan" : "Trung tính"}
                  </span>
                </div>
              </div>

              <div className="group p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-1 justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Kỹ thuật</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-3 opacity-60 hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Đánh giá dựa trên các chỉ báo kỹ thuật và biểu đồ giá.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(forecastData.technical)}
                  <span className={`font-bold ${getStatusColor(forecastData.technical)} text-sm`}>
                    {forecastData.technical === "positive" ? "Khả quan" :
                      forecastData.technical === "negative" ? "Kém khả quan" : "Trung tính"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Compact Footer */}
        <CardFooter className="relative z-10 bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm border-t border-border/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">
              Cập nhật lần cuối: {forecastData.lastUpdated}
            </div>
            <Button
              onClick={handleViewDetails}
              size="sm"
            >
              <span className="font-medium">Chi tiết</span>
              <ArrowRight className="size-3" />
            </Button>
          </div>
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

      {/* Detail Dialog */}
      <ForecastDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        data={detailedForecastData}
      />
    </>
  );
};

export default ForecastOverview;