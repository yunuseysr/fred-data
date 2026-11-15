# FRED Economic Dashboard

A clean, self-hosted dashboard of **25 key U.S. economic indicators** from
[FRED](https://fred.stlouisfed.org) (Federal Reserve Bank of St. Louis) — inflation, jobs, rates, growth,
housing and more, grouped into tabs and drawn as interactive charts.

**No API key, no database, no account.** Data comes straight from FRED's public CSV endpoint and is cached
for a day.

## What's inside

| Tab | Series (FRED id) |
|---|---|
| Key Indicators | CPI growth (CPALTT01USM657N), unemployment (LRUN64TTUSM156S), 10-year yield (IRLTLT01USM156N), 3-month rate (IR3TIB01USM156N) |
| Inflation | CPI MoM (CPALTT01USM657N), Core CPI (CPILFESL), PCE price index (PCEPI) |
| Employment | Unemployment rate (UNRATE), nonfarm payrolls (PAYEMS), labor force participation (CIVPART) |
| Interest Rates | 10-year yield (IRLTLT01USM156N), 3-month rate (IR3TIB01USM156N), Fed funds (FEDFUNDS), 2-year Treasury (DGS2) |
| Economic Growth | Real GDP growth (A191RL1Q225SBEA), real GDP (GDPC1), industrial production (INDPRO) |
| Exchange Rates | USD/EUR (DEXUSEU), broad dollar index (DTWEXBGS) |
| Housing | Housing starts (HOUST), Case-Shiller home prices (CSUSHPINSA), 30-year mortgage rate (MORTGAGE30US) |
| Consumer Spending | Retail sales (RSAFS), personal consumption (PCE) |

## Run it

Requires Node.js 20.9+.

```bash
git clone https://github.com/yunuseysr/fred-data.git
cd fred-data
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

It runs anywhere Next.js runs (a VPS, Docker, Vercel…). Data is fetched on the server, so visitors'
browsers never call FRED directly.

## Add or change charts

Everything lives in [`app/lib/categories.ts`](app/lib/categories.ts). Find a series on
[fred.stlouisfed.org](https://fred.stlouisfed.org) — the id is the last part of its URL — and add it to a tab:

```ts
{
  series: "UNRATE",
  title: "Unemployment Rate",
  seriesLabel: "Unemployment Rate",
  yAxisLabel: "Percent",
  startDate: "2000-01-01", // optional
  zeroLine: false,         // draw a zero baseline (for growth series)
},
```

## How it works

- `app/lib/fred.ts` downloads `fredgraph.csv?id=<series>` with `fetch` (falling back to `curl` on networks
  that block Node's TLS handshake) and caches each series for 24 hours with `unstable_cache`.
- `app/components/FredChart.tsx` draws it with [Recharts](https://recharts.org).
- Built with Next.js (App Router), React and Tailwind CSS.

## License

[MIT](LICENSE). Data © Federal Reserve Bank of St. Louis, subject to
[FRED's terms of use](https://fred.stlouisfed.org/legal/). Not affiliated with the Federal Reserve.
