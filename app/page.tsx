import Sidebar from "./components/Sidebar";
import FredChart from "./components/FredChart";
import { fetchFredSeries, type FredPoint } from "./lib/fred";
import { getCategory } from "./lib/categories";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const cat = getCategory(category);

  const results = await Promise.all(
    cat.charts.map(async (config) => {
      let data: FredPoint[] = [];
      try {
        data = await fetchFredSeries(config.series, config.startDate);
      } catch {
        data = [];
      }
      return { config, data };
    })
  );

  return (
    <div className="flex min-h-screen flex-1 bg-[#f3f4f6] text-gray-900">
      <Sidebar active={cat.id} />

      <main className="flex-1 overflow-auto px-10 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Economic Indicators Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time economic data from the Federal Reserve Economic Data
            (FRED) system
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {results.map(({ config, data }) => (
            <section key={config.series} className="flex flex-col">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {config.title}
              </h2>
              <div className="h-[340px]">
                <FredChart
                  seriesLabel={config.seriesLabel}
                  data={data}
                  yAxisLabel={config.yAxisLabel}
                  zeroLine={config.zeroLine}
                  tintedPlot={config.tinted}
                />
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
