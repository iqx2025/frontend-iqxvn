"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentGaugeProps {
  /** Current sentiment percentage (0-100) */
  realtime?: boolean;
  className?: string;
}

interface TechnicalData {
  oscillation: number; // Giao động
  momentum: number; // Động lượng
  summary: number; // Tổng kết
}

// Define zones for each indicator type
const OSCILLATION_ZONES = [
  {
    label: 'Bán mạnh',
    range: [-6, -4],
    color: '#dc2626', // red-600
    darkColor: '#991b1b' // red-800
  },
  {
    label: 'Bán',
    range: [-4, -1],
    color: '#f59e0b', // amber-500
    darkColor: '#d97706' // amber-600
  },
  {
    label: 'Trung tính',
    range: [-1, 1],
    color: '#6b7280', // gray-500
    darkColor: '#4b5563' // gray-600
  },
  {
    label: 'Mua',
    range: [1, 4],
    color: '#84cc16', // lime-500
    darkColor: '#65a30d' // lime-600
  },
  {
    label: 'Mua mạnh',
    range: [4, 6],
    color: '#22c55e', // green-500
    darkColor: '#16a34a' // green-600
  },
];

const MOMENTUM_ZONES = [
  {
    label: 'Bán mạnh',
    range: [-10, -6],
    color: '#dc2626', // red-600
    darkColor: '#991b1b' // red-800
  },
  {
    label: 'Bán',
    range: [-6, -1],
    color: '#f59e0b', // amber-500
    darkColor: '#d97706' // amber-600
  },
  {
    label: 'Trung tính',
    range: [-1, 1],
    color: '#6b7280', // gray-500
    darkColor: '#4b5563' // gray-600
  },
  {
    label: 'Mua',
    range: [1, 6],
    color: '#84cc16', // lime-500
    darkColor: '#65a30d' // lime-600
  },
  {
    label: 'Mua mạnh',
    range: [6, 10],
    color: '#22c55e', // green-500
    darkColor: '#16a34a' // green-600
  },
];

const SUMMARY_ZONES = [
  {
    label: 'Bán mạnh',
    range: [-1, -0.6],
    color: '#dc2626', // red-600
    darkColor: '#991b1b' // red-800
  },
  {
    label: 'Bán',
    range: [-0.6, -0.2],
    color: '#f59e0b', // amber-500
    darkColor: '#d97706' // amber-600
  },
  {
    label: 'Trung tính',
    range: [-0.2, 0.2],
    color: '#6b7280', // gray-500
    darkColor: '#4b5563' // gray-600
  },
  {
    label: 'Mua',
    range: [0.2, 0.6],
    color: '#84cc16', // lime-500
    darkColor: '#65a30d' // lime-600
  },
  {
    label: 'Mua mạnh',
    range: [0.6, 1],
    color: '#22c55e', // green-500
    darkColor: '#16a34a' // green-600
  },
];

/**
 * Get sentiment label and color based on value and zones
 */
const getSentimentInfo = (value: number, zones: typeof OSCILLATION_ZONES) => {
  for (const zone of zones) {
    if (value >= zone.range[0] && value < zone.range[1]) {
      return {
        label: zone.label,
        color: zone.color
      };
    }
  }
  // Default to last zone if value exceeds range
  const lastZone = zones[zones.length - 1];
  return {
    label: lastZone.label,
    color: lastZone.color
  };
};

/**
 * Convert value to angle for gauge display
 * Maps the value range to 0-180 degrees
 */
const valueToAngle = (value: number, minValue: number, maxValue: number): number => {
  // Clamp value to range
  const clampedValue = Math.max(minValue, Math.min(maxValue, value));
  // Map to 0-180 degrees
  return ((clampedValue - minValue) / (maxValue - minValue)) * 180;
};

/**
 * Sentiment Gauge Component - Semi-circular gauge visualization
 */
export default function SentimentGaugeVNINDEX({
  className,
}: SentimentGaugeProps) {
  const [technicalData, setTechnicalData] = useState<TechnicalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Google Sheets API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets/1ekb2bYAQJZbtmqMUzsagb4uWBdtkAzTq3kuIMHQ22RI/values/TA_VNINDEX?key=AIzaSyB9PPBCGbWFv1TxH_8s_AsiqiChLs9MqXU'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        
        // Parse the data - assuming row 1 has values
        if (data.values && data.values.length > 1) {
          const values = data.values[1]; // Second row contains the actual values
          setTechnicalData({
            oscillation: parseFloat(values[0]?.replace(',', '.') || '0'),
            momentum: parseFloat(values[1]?.replace(',', '.') || '0'),
            summary: parseFloat(values[2]?.replace(',', '.') || '0')
          });
        }
      } catch (err) {
        console.error('Error fetching technical data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set default values on error
        setTechnicalData({
          oscillation: 0,
          momentum: 0,
          summary: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to render a single gauge
  const renderGauge = (
    value: number,
    zones: typeof OSCILLATION_ZONES,
    minValue: number,
    maxValue: number,
    title: string
  ) => {
    const sentimentInfo = getSentimentInfo(value, zones);
    const angle = valueToAngle(value, minValue, maxValue);

    // Calculate segment sizes based on zones
    const totalRange = maxValue - minValue;
    const pieData = zones.map((zone) => {
      const rangeSize = zone.range[1] - zone.range[0];
      const degrees = (rangeSize / totalRange) * 180;
      return {
        name: zone.label,
        value: rangeSize,
        degrees: degrees,
        color: zone.color,
        darkColor: zone.darkColor
      };
    });

    return (
      <div className="relative w-full">
        <h3 className="text-sm font-medium text-center mb-2">{title}</h3>
        <div className="relative" style={{ height: '200px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 220"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Define gradients for each segment */}
              {zones.map((zone, index) => (
                <linearGradient key={`gradient-${title}-${index}`} id={`gradient-${title}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={zone.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={zone.darkColor} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>

          {/* Draw gauge segments */}
          <g transform="translate(200, 180)">
            {/* Draw each segment with correct proportions */}
            {pieData.map((zone, index) => {
              // Calculate cumulative angles based on actual segment sizes
              const cumulativeAngle = pieData.slice(0, index).reduce((sum, z) => sum + z.degrees, 0);
              const startAngle = 180 - cumulativeAngle;
              const endAngle = 180 - (cumulativeAngle + zone.degrees);
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;

              const innerRadius = 80;
              const outerRadius = 140;

              // Calculate path points
              const x1 = innerRadius * Math.cos(startAngleRad);
              const y1 = innerRadius * Math.sin(startAngleRad);
              const x2 = outerRadius * Math.cos(startAngleRad);
              const y2 = outerRadius * Math.sin(startAngleRad);
              const x3 = outerRadius * Math.cos(endAngleRad);
              const y3 = outerRadius * Math.sin(endAngleRad);
              const x4 = innerRadius * Math.cos(endAngleRad);
              const y4 = innerRadius * Math.sin(endAngleRad);

              const largeArcFlag = 0; // Since each segment is less than 180 degrees

              const pathData = [
                `M ${x1} ${-y1}`,
                `L ${x2} ${-y2}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${-y3}`,
                `L ${x4} ${-y4}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${-y1}`,
                'Z'
              ].join(' ');

              return (
                <path
                  key={`segment-${index}`}
                  d={pathData}
                  fill={zone.color}
                  stroke="white"
                  strokeWidth="2"
                  opacity={0.9}
                />
              );
            })}

              {/* Add zone labels */}
              {zones.map((zone, index) => {
                // Calculate label position for each zone
                const cumulativeAngle = pieData.slice(0, index).reduce((sum, z) => sum + z.degrees, 0);
                const midAngle = 180 - (cumulativeAngle + pieData[index].degrees / 2);
                const midAngleRad = (midAngle * Math.PI) / 180;
                const labelRadius = 165;
                const x = labelRadius * Math.cos(midAngleRad);
                const y = -labelRadius * Math.sin(midAngleRad);

                return (
                  <text
                    key={`label-${title}-${index}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    className="text-muted-foreground"
                  >
                    {zone.label}
                  </text>
                );
              })}

              {/* Needle/Pointer */}
              <g>
                {/* Calculate needle position based on value */}
                {(() => {
                  const needleAngle = 180 - angle;
                  const needleAngleRad = (needleAngle * Math.PI) / 180;
                  const needleLength = 100;
                  const x2 = needleLength * Math.cos(needleAngleRad);
                  const y2 = -needleLength * Math.sin(needleAngleRad);

                  return (
                    <>
                      {/* Needle */}
                      <line
                        x1="0"
                        y1="0"
                        x2={x2}
                        y2={y2}
                        stroke={sentimentInfo.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Center circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r="8"
                        fill={sentimentInfo.color}
                      />
                    </>
                  );
                })()}
              </g>
            </g>
          </svg>

          {/* Value display positioned above the gauge */}
          <div className="absolute inset-x-0 -bottom-2 flex flex-col items-center">
            <span 
              className="text-sm font-semibold mt-1 px-3 py-0.5 uppercase rounded"
              style={{ 
                backgroundColor: sentimentInfo.color + '20',
                color: sentimentInfo.color 
              }}
            >
              {sentimentInfo.label}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <CardTitle className="text-lg font-semibold">
                Phân tích kỹ thuật
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg font-semibold">
              Phân tích kỹ thuật
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Phân tích Kỹ thuật VN-Index
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Tổng kết</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Oscillation Gauge */}
          <div className="space-y-2">
            <h3 className="text-center text-sm font-semibold text-muted-foreground">Các Chỉ Số Kỹ Thuật</h3>
            {technicalData && renderGauge(
              technicalData.oscillation,
              OSCILLATION_ZONES,
              -6,
              6,
              ''
            )}
          </div>

          {/* Summary Gauge - Center with larger display */}
          <div className="space-y-2">
            <h3 className="text-center text-sm font-semibold">Tổng kết</h3>
            {technicalData && renderGauge(
              technicalData.summary,
              SUMMARY_ZONES,
              -1,
              1,
              ''
            )}
          </div>

          {/* Momentum Gauge */}
          <div className="space-y-2">
            <h3 className="text-center text-sm font-semibold text-muted-foreground">Trung bình Động</h3>
            {technicalData && renderGauge(
              technicalData.momentum,
              MOMENTUM_ZONES,
              -10,
              10,
              ''
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-center text-sm text-yellow-600">
            <p>Không thể tải dữ liệu thời gian thực</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
