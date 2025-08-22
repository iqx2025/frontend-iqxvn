
import ZScoreChart from "@/components/business/z-score-chart";
import FScoreChart from "@/components/business/f-score-chart";
import FScoreDetails from "./business/f-score-details";

export interface ScoreProps {
    ticker: string;
}

export default function ScoreContent({ ticker }: ScoreProps) {
    return (

        <>

            <section className="my-8">
                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    {/* Biểu đồ Z-Score */}
                    <ZScoreChart ticker={ticker.toUpperCase()} />

                    {/* Biểu đồ F-Score */}
                    <FScoreChart ticker={ticker.toUpperCase()} />
                </div>

                <FScoreDetails ticker={ticker.toUpperCase()} />

            </section>

            </>

    )
}
