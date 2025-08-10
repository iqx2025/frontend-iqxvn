"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

import type {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../public/charting_library/charting_library";

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "VNINDEX",
  interval: "D" as ResolutionString,
  library_path: "/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false }
);


export default function TechnicalAnalysisPage() {
  const [scriptsLoaded, setScriptsLoaded] = useState({ cl: false, udf: false });
  const isReady = scriptsLoaded.cl && scriptsLoaded.udf;
  return (
    <>
      <Script
        src="/charting_library/charting_library.js"
        strategy="lazyOnload"
        onLoad={() => setScriptsLoaded((s) => ({ ...s, cl: true }))}
      />
      <Script
        src="/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onLoad={() => setScriptsLoaded((s) => ({ ...s, udf: true }))}
      />
      {isReady && <TVChartContainer {...defaultWidgetProps} />}
    </>
  );
}