"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentGaugeProps {
  /** Current sentiment percentage (0-100) */
  percent: number;
  /** Show real-time updates */
  realtime?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Hide card wrapper */
  noCard?: boolean;
}

/**
 * Sentiment zones configuration
 * Updated based on new requirements:
 * >70%: Lạc quan quá mức
 * 55%-70%: Lạc quan
 * 45%-55%: Trung tính
 * 30%-45%: Bi quan
 * <30%: Bi quan quá mức
 */
const SENTIMENT_ZONES = [
  { 
    label: 'Bi quan quá mức', 
    range: [0, 30], 
    color: '#dc2626', // red-600
    darkColor: '#991b1b' // red-800
  },
  { 
    label: 'Bi quan', 
    range: [30, 45], 
    color: '#f59e0b', // amber-500
    darkColor: '#d97706' // amber-600
  },
  { 
    label: 'Trung tính', 
    range: [45, 55], 
    color: '#eab308', // yellow-500
    darkColor: '#ca8a04' // yellow-600
  },
  { 
    label: 'Lạc quan', 
    range: [55, 70], 
    color: '#84cc16', // lime-500
    darkColor: '#65a30d' // lime-600
  },
  { 
    label: 'Lạc quan quá mức', 
    range: [70, 100], 
    color: '#22c55e', // green-500
    darkColor: '#16a34a' // green-600
  },
];

/**
 * Get sentiment label based on percentage
 */
const getSentimentLabel = (percent: number): string => {
  if (percent > 70) return 'Lạc quan quá mức';
  if (percent >= 55) return 'Lạc quan';
  if (percent >= 45) return 'Trung tính';
  if (percent >= 30) return 'Bi quan';
  return 'Bi quan quá mức';
};

/**
 * Get sentiment color based on percentage
 */
const getSentimentColor = (percent: number): string => {
  if (percent > 70) return '#22c55e'; // green-500
  if (percent >= 55) return '#84cc16'; // lime-500
  if (percent >= 45) return '#eab308'; // yellow-500
  if (percent >= 30) return '#f59e0b'; // amber-500
  return '#dc2626'; // red-600
};

/**
 * Custom Needle Component for the Gauge
 */
const RADIAN = Math.PI / 180;
const renderNeedle = (
  value: number,
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string
) => {
  // Calculate the angle for the needle position
  // Value is 0-100, we need to map it to 180-0 degrees (left to right)
  const angle = 180 - (value * 1.8); // Convert percentage to angle
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  
  // Calculate needle length (85% of the outer radius)
  const r = oR * 0.85;
  
  // Needle tip position
  const x1 = cx + r * cos;
  const y1 = cy + r * sin;
  
  // Needle base width
  const baseWidth = 4;
  const baseAngle = angle + 90;
  const baseSin = Math.sin(-RADIAN * baseAngle);
  const baseCos = Math.cos(-RADIAN * baseAngle);
  
  // Calculate the two base points of the triangle
  const x2 = cx + baseWidth * baseCos;
  const y2 = cy + baseWidth * baseSin;
  const x3 = cx - baseWidth * baseCos;
  const y3 = cy - baseWidth * baseSin;

  return (
    <g>
      {/* Needle line for cleaner look */}
      <line
        x1={cx}
        y1={cy}
        x2={x1}
        y2={y1}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Center circle */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="white"
        stroke={color}
        strokeWidth={2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
      />
    </g>
  );
};

/**
 * Sentiment Gauge Component - Semi-circular gauge visualization
 */
export default function SentimentGauge({ 
  percent, 
  realtime = false,
  className,
  noCard = false 
}: SentimentGaugeProps) {
  // Prepare data for the pie chart segments with new zones
  const pieData = useMemo(() => {
    // Calculate segment sizes based on new zones
    // Total 180 degrees: 0-30 (30°), 30-45 (15°), 45-55 (10°), 55-70 (15°), 70-100 (30°)
    const segmentSizes = [30, 15, 10, 15, 30]; // Proportional to range sizes
    const totalDegrees = 180;
    
    return SENTIMENT_ZONES.map((zone, index) => ({
      name: zone.label,
      value: segmentSizes[index],
      degrees: (segmentSizes[index] / 100) * totalDegrees,
      color: zone.color,
      darkColor: zone.darkColor
    }));
  }, []);

  // Get current sentiment label and color
  const sentimentLabel = getSentimentLabel(percent);
  const sentimentColor = getSentimentColor(percent);

  // Determine icon based on sentiment
  const SentimentIcon = percent > 55 ? TrendingUp : percent < 45 ? TrendingDown : Activity;

  const gaugeContent = (
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
            {SENTIMENT_ZONES.map((zone, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
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
            
            {/* Add zone labels with fixed positions */}
            {pieData.map((zone, index) => {
              // Use fixed positions for labels to avoid hydration issues
              const labelPositions = [
                { x: -160, y: -50 },  // Bi quan quá mức
                { x: -85, y: -130 }, // Bi quan  
                { x: 0, y: -150 },    // Trung tính
                { x: 85, y: -130 },  // Lạc quan
                { x: 160, y: -50 }    // Lạc quan quá mức
              ];
              
              const pos = labelPositions[index];
              const shortLabels = ['Bi quan\nquá mức', 'Bi quan', 'Trung tính', 'Lạc quan', 'Lạc quan\nquá mức'];
              
              if (!shortLabels[index]) return null;
              
              return (
                <text
                  key={`label-${index}`}
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
            
            {/* Draw the needle with arrow pointer */}
            {renderNeedle(percent, 200, 180, 80, 140, sentimentColor)}
            
            {/* Add directional arrows pointing to zones */}
            {/* Arrow pointing to current zone */}
            <g transform={`translate(200, 180)`}>
              {/* Calculate arrow position based on percent */}
              {(() => {
                const angle = 180 - (percent * 1.8);
                const angleRad = (angle * Math.PI) / 180;
                const arrowRadius = 155;
                const x = arrowRadius * Math.cos(angleRad);
                const y = -arrowRadius * Math.sin(angleRad);
                
                return (
                  <g transform={`translate(${x}, ${y})`}>
                    {/* Arrow shape pointing inward */}
                    <path
                      d="M 0 -8 L -5 0 L 0 -2 L 5 0 Z"
                      fill={sentimentColor}
                      stroke="white"
                      strokeWidth="1"
                      transform={`rotate(${-angle + 90})`}
                      className="animate-pulse"
                    />
                  </g>
                );
              })()}
            </g>
          </g>
        </svg>
        
        {/* Value display positioned above the gauge */}
        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span 
              className="text-5xl font-bold"
              style={{ color: sentimentColor }}
            >
              {percent}%
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground mt-1">
            {sentimentLabel}
          </span>
          {realtime && (
            <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Trực tiếp
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (noCard) {
    return <div className={className}>{gaugeContent}</div>;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Tâm lý thị trường
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Chỉ số đo lường tâm lý nhà đầu tư
        </p>
      </CardHeader>
      <CardContent>
        {gaugeContent}
      </CardContent>
    </Card>
  );
}
