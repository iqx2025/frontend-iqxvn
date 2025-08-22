"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentGaugeProps {
  className?: string;
}

interface TechnicalData {
  oscillation: number;  // Giao động
  momentum: number;     // Động lượng  
  summary: number;      // Tổng kết
  timestamp?: Date;
}

/**
 * Get oscillation label based on value
 */
const getOscillationLabel = (value: number): string => {
  if (value >= 4) return 'Mua mạnh';
  if (value >= 1) return 'Mua';
  if (value >= -1) return 'Trung tính';
  if (value >= -4) return 'Bán';
  return 'Bán mạnh';
};

/**
 * Get momentum label based on value
 */
const getMomentumLabel = (value: number): string => {
  if (value >= 6) return 'Mua mạnh';
  if (value >= 1) return 'Mua';
  if (value >= -1) return 'Trung tính';
  if (value >= -6) return 'Bán';
  return 'Bán mạnh';
};

/**
 * Get summary label based on value
 */
const getSummaryLabel = (value: number): string => {
  if (value >= 0.6) return 'Mua mạnh';
  if (value >= 0.2) return 'Mua';
  if (value >= -0.2) return 'Trung tính';
  if (value >= -0.6) return 'Bán';
  return 'Bán mạnh';
};

/**
 * Get color based on label
 */
const getColorByLabel = (label: string): string => {
  if (label === 'Mua mạnh') return '#22c55e'; // green-500
  if (label === 'Mua') return '#84cc16'; // lime-500
  if (label === 'Trung tính') return '#eab308'; // yellow-500
  if (label === 'Bán') return '#f59e0b'; // amber-500
  return '#dc2626'; // red-600
};

export default function SentimentGaugeVNIndex({
  className,
}: SentimentGaugeProps) {
  const [data, setData] = useState<TechnicalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/1ekb2bYAQJZbtmqMUzsagb4uWBdtkAzTq3kuIMHQ22RI/values/TA_VNINDEX?key=AIzaSyB9PPBCGbWFv1TxH_8s_AsiqiChLs9MqXU'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      
      if (result.values && result.values.length >= 2) {
        const values = result.values[1];
        
        // Parse values (handle comma as decimal separator)
        const oscillation = parseFloat(values[0]?.replace(',', '.') || '0');
        const momentum = parseFloat(values[1]?.replace(',', '.') || '0');
        const summary = parseFloat(values[2]?.replace(',', '.') || '0');
        
        setData({
          oscillation,
          momentum,
          summary,
          timestamp: new Date()
        });
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
      console.error('Error fetching technical data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicalData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTechnicalData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderGauge = (value: number, min: number, max: number, getLabel: (v: number) => string, title: string) => {
    // Define zones for this gauge
    const zones = [
      { label: 'Bán mạnh', color: '#dc2626', darkColor: '#991b1b' },
      { label: 'Bán', color: '#f59e0b', darkColor: '#d97706' },
      { label: 'Trung tính', color: '#eab308', darkColor: '#ca8a04' },
      { label: 'Mua', color: '#84cc16', darkColor: '#65a30d' },
      { label: 'Mua mạnh', color: '#22c55e', darkColor: '#16a34a' },
    ];

    return (
      <div className="relative w-full">
        <div className="relative" style={{ height: '250px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 220"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Define gradients for each segment */}
              {zones.map((zone, index) => (
                <linearGradient 
                  key={`gradient-${title}-${index}`} 
                  id={`gradient-${title}-${index}`} 
                  x1="0%" y1="0%" 
                  x2="100%" y2="100%"
                >
                  <stop offset="0%" stopColor={zone.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={zone.darkColor} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>

            {/* Draw gauge segments */}
            <g transform="translate(200, 180)">
              {/* Draw each segment with equal proportions (36 degrees each for 5 segments) */}
              {zones.map((zone, index) => {
                // Each segment is 36 degrees (180 / 5)
                const segmentDegrees = 36;
                const startAngle = 180 - (index * segmentDegrees);
                const endAngle = 180 - ((index + 1) * segmentDegrees);
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
                    key={`segment-${title}-${index}`}
                    d={pathData}
                    fill={zone.color}
                    stroke="white"
                    strokeWidth="2"
                    opacity={0.9}
                  />
                );
              })}

              {/* Add zone labels with fixed positions */}
              {zones.map((zone, index) => {
                // Use fixed positions for labels to avoid hydration issues
                const labelPositions = [
                  { x: -160, y: -50 },  // Bán mạnh
                  { x: -85, y: -130 },  // Bán  
                  { x: 0, y: -150 },    // Trung tính
                  { x: 85, y: -130 },   // Mua
                  { x: 160, y: -50 }    // Mua mạnh
                ];

                const pos = labelPositions[index];
                const shortLabels = ['Bán\nmạnh', 'Bán', 'Trung tính', 'Mua', 'Mua\nmạnh'];

                if (!shortLabels[index]) return null;

                return (
                  <text
                    key={`label-${title}-${index}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    fontSize="11"
                    fill="currentColor"
                    className="text-muted-foreground"
                  >
                    {shortLabels[index].split('\n').map((line, i) => (
                      <tspan key={i} x={pos.x} dy={i === 0 ? 0 : 12}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              })}

              {/* Gauge needle based on actual value */}
              {(() => {
                // Normalize value to 0-100 scale for angle calculation
                const normalizedValue = ((value - min) / (max - min)) * 100;
                const angle = 180 - (normalizedValue * 1.8);
                const angleRad = (angle * Math.PI) / 180;
                const needleLength = 110;
                const x2 = needleLength * Math.cos(angleRad);
                const y2 = -needleLength * Math.sin(angleRad);

                return (
                  <>
                    {/* Needle line */}
                    <line
                      x1="0"
                      y1="0"
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-foreground"
                    />
                    {/* Center dot */}
                    <circle cx="0" cy="0" r="8" fill="currentColor" className="text-foreground" />
                  </>
                );
              })()}
            </g>
          </svg>

          {/* Value display positioned above the gauge */}
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {title}
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: getColorByLabel(getLabel(value)) }}
              >
                {value.toFixed(2)}
              </span>
            </div>
            <span
              className="text-sm font-semibold mt-1 px-2 py-1 rounded"
              style={{ 
                backgroundColor: getColorByLabel(getLabel(value)),
                color: 'white'
              }}
            >
              {getLabel(value)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-semibold">
                Phân tích kỹ thuật VN-Index
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Các chỉ báo kỹ thuật và xu hướng thị trường
              </p>
            </div>
          </div>
          
          <Button
            onClick={fetchTechnicalData}
            disabled={loading}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading && !data && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">Tổng kết</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Oscillation Gauge */}
              <div>
                {renderGauge(
                  data.oscillation,
                  -6,
                  6,
                  getOscillationLabel,
                  'Các Chỉ Số Kỹ Thuật'
                )}
              </div>

              {/* Summary Gauge - Center */}
              <div>
                {renderGauge(
                  data.summary,
                  -1,
                  1,
                  getSummaryLabel,
                  'Tổng kết'
                )}
              </div>

              {/* Momentum Gauge */}
              <div>
                {renderGauge(
                  data.momentum,
                  -10,
                  10,
                  getMomentumLabel,
                  'Trung bình Động'
                )}
              </div>
            </div>

            {data.timestamp && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Cập nhật lần cuối: {data.timestamp.toLocaleString('vi-VN')}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
