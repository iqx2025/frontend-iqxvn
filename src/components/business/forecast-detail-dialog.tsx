"use client"

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Globe,
  Zap,
} from "lucide-react";
import { ForecastDetailDialogProps, StatusType } from "@/types/forecast";

const ForecastDetailDialog: React.FC<ForecastDetailDialogProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "positive":
        return "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "negative":
        return "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      case "neutral":
        return "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
      default:
        return "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusBadgeVariant = (status: StatusType) => {
    switch (status) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      case "neutral":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTrendIcon = () => {
    return data.trend === "up" ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-screen-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTrendIcon()}
            Chi tiết dự báo thị trường
          </DialogTitle>
          <DialogDescription>
            Phân tích chi tiết và khuyến nghị đầu tư cho tuần này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Xu hướng:</span>
                    <Badge variant={getStatusBadgeVariant(data.trend === "up" ? "positive" : "negative")}>
                      {data.trend === "up" ? "Tăng" : "Giảm"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Độ tin cậy:</span>
                    <span className="font-semibold">{data.confidence}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cập nhật:</span>
                    <span className="text-sm">{data.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tỉ lệ rủi ro:</span>
                    <span className="font-semibold text-green-500">{data.riskRatio}%</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">{data.analysis.summary}</p>
            </CardContent>
          </Card>

          {/* Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Chỉ số chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${getStatusColor(data.macro)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Vĩ mô</span>
                  </div>
                  <div className="text-lg font-bold">
                    {data.macro === "positive" ? "Khả quan" :
                      data.macro === "negative" ? "Kém khả quan" : "Trung tính"}
                  </div>
                  <p className="text-xs mt-1">{data.metrics.macro.description}</p>
                </div>

                <div className={`p-4 rounded-lg border ${getStatusColor(data.momentum)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Động lượng</span>
                  </div>
                  <div className="text-lg font-bold">
                    {data.momentum === "positive" ? "Khả quan" :
                      data.momentum === "negative" ? "Kém khả quan" : "Trung tính"}
                  </div>
                  <p className="text-xs mt-1">{data.metrics.momentum.description}</p>
                </div>

                <div className={`p-4 rounded-lg border ${getStatusColor(data.technical)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Kỹ thuật</span>
                  </div>
                  <div className="text-lg font-bold">
                    {data.technical === "positive" ? "Khả quan" :
                      data.technical === "negative" ? "Kém khả quan" : "Trung tính"}
                  </div>
                  <p className="text-xs mt-1">{data.metrics.technical.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Rủi ro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.analysis.risks.map((risk, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Cơ hội
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.analysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Section */}
          <Card>
            <CardHeader>
              <CardTitle>Khuyến nghị đầu tư</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Ngắn hạn</h4>
                  <ul className="space-y-2">
                    {data.recommendations.shortTerm.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Dài hạn</h4>
                  <ul className="space-y-2">
                    {data.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForecastDetailDialog;
