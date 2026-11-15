// Dashboard categories (sidebar tabs) and the FRED series shown in each.

export type ChartConfig = {
  /** FRED series id used by the fredgraph CSV endpoint. */
  series: string;
  /** Card heading. */
  title: string;
  /** Series name shown in the FRED legend strip. */
  seriesLabel: string;
  /** Y-axis caption. */
  yAxisLabel: string;
  /** Optional start date override (ISO). */
  startDate?: string;
  /** Draw a solid black zero baseline (growth/percent-change series). */
  zeroLine?: boolean;
  /** Light-blue tinted plot background. */
  tinted?: boolean;
};

export type Category = {
  id: string;
  label: string;
  icon: IconKey;
  charts: ChartConfig[];
};

export type IconKey =
  | "trending"
  | "activity"
  | "users"
  | "percent"
  | "globe"
  | "home"
  | "cart";

export const categories: Category[] = [
  {
    id: "key-indicators",
    label: "Key Indicators",
    icon: "trending",
    charts: [
      {
        series: "CPALTT01USM657N",
        title: "CPI - last five years",
        seriesLabel: "Consumer Price Index: All Items: Total for United States",
        yAxisLabel: "Growth rate previous period",
        zeroLine: true,
      },
      {
        series: "LRUN64TTUSM156S",
        title: "Infra-Annual Labor Statistics: Unemployment Rate Total",
        seriesLabel:
          "Infra-Annual Labor Statistics: Unemployment Rate Total: From 15 to 64 Years for United States",
        yAxisLabel: "Percent",
      },
      {
        series: "IRLTLT01USM156N",
        title: "Interest Rates: Long-Term Government Bond Yields: 10-Year",
        seriesLabel:
          "Interest Rates: Long-Term Government Bond Yields: 10-Year: Main (Including Benchmark) for United States",
        yAxisLabel: "Percent",
        tinted: true,
      },
      {
        series: "IR3TIB01USM156N",
        title: "Interest Rates: 3-Month or 90-Day Rates and Yields",
        seriesLabel:
          "Interest Rates: 3-Month or 90-Day Rates and Yields: Interbank Rates: Total for United States",
        yAxisLabel: "Percent",
      },
    ],
  },
  {
    id: "inflation",
    label: "Inflation",
    icon: "trending",
    charts: [
      {
        series: "CPALTT01USM657N",
        title: "CPI Growth Rate (Month over Month)",
        seriesLabel: "Consumer Price Index: All Items: Total for United States",
        yAxisLabel: "Growth rate previous period",
        zeroLine: true,
      },
      {
        series: "CPILFESL",
        title: "Core CPI: All Items Less Food and Energy",
        seriesLabel:
          "Consumer Price Index for All Urban Consumers: All Items Less Food and Energy",
        yAxisLabel: "Index 1982-84=100",
        tinted: true,
      },
      {
        series: "PCEPI",
        title: "PCE Price Index",
        seriesLabel:
          "Personal Consumption Expenditures: Chain-type Price Index",
        yAxisLabel: "Index 2017=100",
      },
    ],
  },
  {
    id: "employment",
    label: "Employment",
    icon: "users",
    charts: [
      {
        series: "UNRATE",
        title: "Unemployment Rate",
        seriesLabel: "Unemployment Rate",
        yAxisLabel: "Percent",
      },
      {
        series: "PAYEMS",
        title: "Total Nonfarm Payroll Employment",
        seriesLabel: "All Employees, Total Nonfarm",
        yAxisLabel: "Thousands of Persons",
        tinted: true,
      },
      {
        series: "CIVPART",
        title: "Labor Force Participation Rate",
        seriesLabel: "Labor Force Participation Rate",
        yAxisLabel: "Percent",
      },
    ],
  },
  {
    id: "interest-rates",
    label: "Interest Rates",
    icon: "percent",
    charts: [
      {
        series: "IRLTLT01USM156N",
        title: "10-Year Government Bond Yields",
        seriesLabel:
          "Interest Rates: Long-Term Government Bond Yields: 10-Year: Main (Including Benchmark) for United States",
        yAxisLabel: "Percent",
        tinted: true,
      },
      {
        series: "IR3TIB01USM156N",
        title: "3-Month or 90-Day Rates and Yields",
        seriesLabel:
          "Interest Rates: 3-Month or 90-Day Rates and Yields: Interbank Rates: Total for United States",
        yAxisLabel: "Percent",
      },
      {
        series: "FEDFUNDS",
        title: "Federal Funds Effective Rate",
        seriesLabel: "Federal Funds Effective Rate",
        yAxisLabel: "Percent",
      },
      {
        series: "DGS2",
        title: "2-Year Treasury Constant Maturity",
        seriesLabel:
          "Market Yield on U.S. Treasury Securities at 2-Year Constant Maturity",
        yAxisLabel: "Percent",
      },
    ],
  },
  {
    id: "economic-growth",
    label: "Economic Growth",
    icon: "activity",
    charts: [
      {
        series: "A191RL1Q225SBEA",
        title: "Real GDP Growth Rate",
        seriesLabel: "Real Gross Domestic Product, Percent Change from Preceding Period",
        yAxisLabel: "Percent change",
        zeroLine: true,
      },
      {
        series: "GDPC1",
        title: "Real Gross Domestic Product",
        seriesLabel: "Real Gross Domestic Product",
        yAxisLabel: "Billions of Chained 2017 Dollars",
        tinted: true,
      },
      {
        series: "INDPRO",
        title: "Industrial Production: Total Index",
        seriesLabel: "Industrial Production: Total Index",
        yAxisLabel: "Index 2017=100",
      },
    ],
  },
  {
    id: "exchange-rates",
    label: "Exchange Rates",
    icon: "globe",
    charts: [
      {
        series: "DEXUSEU",
        title: "U.S. Dollars to Euro Spot Exchange Rate",
        seriesLabel: "U.S. Dollars to Euro Spot Exchange Rate",
        yAxisLabel: "U.S. Dollars to One Euro",
        tinted: true,
      },
      {
        series: "DTWEXBGS",
        title: "Nominal Broad U.S. Dollar Index",
        seriesLabel: "Nominal Broad U.S. Dollar Index",
        yAxisLabel: "Index Jan 2006=100",
      },
    ],
  },
  {
    id: "housing",
    label: "Housing",
    icon: "home",
    charts: [
      {
        series: "HOUST",
        title: "Housing Starts: Total New Privately-Owned",
        seriesLabel: "New Privately-Owned Housing Units Started: Total Units",
        yAxisLabel: "Thousands of Units",
        tinted: true,
      },
      {
        series: "CSUSHPINSA",
        title: "Case-Shiller U.S. National Home Price Index",
        seriesLabel: "S&P CoreLogic Case-Shiller U.S. National Home Price Index",
        yAxisLabel: "Index Jan 2000=100",
      },
      {
        series: "MORTGAGE30US",
        title: "30-Year Fixed Rate Mortgage Average",
        seriesLabel: "30-Year Fixed Rate Mortgage Average in the United States",
        yAxisLabel: "Percent",
      },
    ],
  },
  {
    id: "consumer-spending",
    label: "Consumer Spending",
    icon: "cart",
    charts: [
      {
        series: "RSAFS",
        title: "Advance Retail Sales: Retail and Food Services",
        seriesLabel: "Advance Retail Sales: Retail Trade and Food Services",
        yAxisLabel: "Millions of Dollars",
        tinted: true,
      },
      {
        series: "PCE",
        title: "Personal Consumption Expenditures",
        seriesLabel: "Personal Consumption Expenditures",
        yAxisLabel: "Billions of Dollars",
      },
    ],
  },
];

export function getCategory(id?: string): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}
