"use client";

import React, { useState } from 'react';
import MarketSentimentDashboard from './market-sentiment-dashboard';
import MarketSentimentDashboardV2 from './market-sentiment-dashboard-v2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  Layers, 
  Maximize2, 
  Monitor, 
  Smartphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MarketSentimentComparisonProps {
  className?: string;
  useMock?: boolean;
}

/**
 * Comparison View - Side by side dashboard versions
 */
export default function MarketSentimentComparison({
  className,
  useMock = true
}: MarketSentimentComparisonProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'tabs' | 'overlay'>('tabs');
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2'>('v2');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-4xl',
    mobile: 'max-w-sm'
  };

  const FeatureComparison = () => (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Version 1</CardTitle>
            <Badge variant="secondary">Original</Badge>
          </div>
          <CardDescription>Initial implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Layout</span>
              <span className="font-medium">2x2 Grid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Header</span>
              <span className="font-medium">Basic</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Statistics</span>
              <span className="font-medium">Embedded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sections</span>
              <span className="font-medium">Flat</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Visual Hierarchy</span>
              <span className="font-medium">Standard</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Version 2</CardTitle>
            <Badge>Redesigned</Badge>
          </div>
          <CardDescription>Enhanced layout & structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Layout</span>
              <span className="font-medium text-green-600">Sectioned</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Header</span>
              <span className="font-medium text-green-600">Enhanced</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Statistics</span>
              <span className="font-medium text-green-600">Summary Cards</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sections</span>
              <span className="font-medium text-green-600">Hierarchical</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Visual Hierarchy</span>
              <span className="font-medium text-green-600">Improved</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Comparison</h2>
        <p className="text-muted-foreground">
          Compare the original and redesigned versions of the Market Sentiment Dashboard
        </p>
      </div>

      {/* View Mode Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'tabs' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tabs')}
            className="gap-2"
          >
            <Layers className="h-4 w-4" />
            Tabs
          </Button>
          <Button
            variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('side-by-side')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Side by Side
          </Button>
          <Button
            variant={viewMode === 'overlay' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overlay')}
            className="gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Overlay
          </Button>
        </div>

        {/* Device Preview (for tabs mode) */}
        {viewMode === 'tabs' && (
          <div className="flex items-center gap-2">
            <Button
              variant={devicePreview === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('tablet')}
            >
              <Smartphone className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant={devicePreview === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Feature Comparison */}
      <FeatureComparison />

      {/* Dashboard Views */}
      {viewMode === 'tabs' && (
        <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as 'v1' | 'v2')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="v1">Version 1</TabsTrigger>
            <TabsTrigger value="v2">Version 2</TabsTrigger>
          </TabsList>

          <TabsContent value="v1" className="mt-6">
            <div className={cn("mx-auto transition-all", deviceWidths[devicePreview])}>
              <Card className="p-4">
                <MarketSentimentDashboard 
                  useMock={useMock}
                  enableRealtime={false}
                  refreshInterval={0}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="v2" className="mt-6">
            <div className={cn("mx-auto transition-all", deviceWidths[devicePreview])}>
              <Card className="p-4">
                <MarketSentimentDashboardV2 
                  useMock={useMock}
                  enableRealtime={false}
                  refreshInterval={0}
                  compact={devicePreview === 'mobile'}
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Version 1 - Original</h3>
              <p className="text-sm text-muted-foreground">2x2 Grid Layout</p>
            </div>
            <Card className="p-4 overflow-auto">
              <MarketSentimentDashboard 
                useMock={useMock}
                enableRealtime={false}
                refreshInterval={0}
              />
            </Card>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Version 2 - Redesigned</h3>
              <p className="text-sm text-muted-foreground">Sectioned Layout</p>
            </div>
            <Card className="p-4 overflow-auto">
              <MarketSentimentDashboardV2 
                useMock={useMock}
                enableRealtime={false}
                refreshInterval={0}
              />
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'overlay' && (
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedVersion === 'v1' ? 'Version 1 - Original' : 'Version 2 - Redesigned'}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVersion(selectedVersion === 'v1' ? 'v2' : 'v1')}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Switch to {selectedVersion === 'v1' ? 'V2' : 'V1'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="p-4">
            {selectedVersion === 'v1' ? (
              <MarketSentimentDashboard 
                useMock={useMock}
                enableRealtime={false}
                refreshInterval={0}
              />
            ) : (
              <MarketSentimentDashboardV2 
                useMock={useMock}
                enableRealtime={false}
                refreshInterval={0}
              />
            )}
          </Card>
        </div>
      )}

      {/* Improvements Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Key Improvements in Version 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Clear visual hierarchy with section headers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Summary statistics cards at the top</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Consistent spacing between sections</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Enhanced header with status badges</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Better responsive design for mobile</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Improved loading and error states</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Compact mode for smaller displays</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>More structured data organization</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
