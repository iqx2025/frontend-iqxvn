import { useEffect, useRef } from "react";
import type { ChartingLibraryWidgetOptions, LanguageCode, ResolutionString } from "../../../public/charting_library/charting_library";

export const TVChartContainer = (props: Partial<ChartingLibraryWidgetOptions>) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!chartContainerRef.current) return;
		const widgetOptions: ChartingLibraryWidgetOptions = {
			symbol: props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
				"/api/tv",
				undefined,
				{
					maxResponseLength: 1000,
					expectedOrder: "latestFirst",
				}
			),
			interval: props.interval as ResolutionString,
			container: chartContainerRef.current,
			library_path: props.library_path,
			locale: (new URLSearchParams(window.location.search).get('lang') || 'vi') as LanguageCode,
			disabled_features: ["use_localstorage_for_settings"],
			enabled_features: ["study_templates"],
			charts_storage_url: props.charts_storage_url,
			charts_storage_api_version: props.charts_storage_api_version,
			client_id: props.client_id,
			user_id: props.user_id,

			fullscreen: props.fullscreen,
			autosize: props.autosize
		};

		const tvWidget = new window.TradingView.widget(widgetOptions);

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute("title", "Click to show a notification popup");
				button.classList.add("apply-common-tooltip");
				
				button.addEventListener("click", () =>
					tvWidget.showNoticeDialog({
						title: "Notification",
						body: "TradingView Charting Library API works correctly",
						callback: () => {
							console.log("Noticed!");
						},
					})
				);

				button.innerHTML = "Check API";
			});
		});

		return () => {
			tvWidget.remove();
		};
	}, [props]);

	return (
		<>
			<div ref={chartContainerRef} className='h-screen' />
		</>
	);
};