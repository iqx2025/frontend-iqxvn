import type { ChartingLibraryWidgetConstructor, IBasicDataFeed } from '../../public/charting_library/charting_library';

declare global {
  interface Window {
    TradingView: {
      widget: ChartingLibraryWidgetConstructor;
    };
    Datafeeds: {
      UDFCompatibleDatafeed: new (
        url: string,
        updateFrequency?: number,
        options?: {
          maxResponseLength?: number;
          expectedOrder?: string;
        }
      ) => IBasicDataFeed;
    };
  }
}

export {};
