"use client";

import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatMonth, type FredPoint } from "../lib/fredFormat";

const FRED_BLUE = "#4778C0";
// NBER COVID-19 recession: Feb 2020 (peak) – Apr 2020 (trough).
const RECESSION_START = "2020-02-01";
const RECESSION_END = "2020-04-30";

type FredChartProps = {
  seriesLabel: string;
  data: FredPoint[];
  yAxisLabel?: string;
  zeroLine?: boolean;
  tintedPlot?: boolean;
};

/** Format a y-axis tick — compact for large magnitudes, plain otherwise. */
function formatYTick(v: number): string {
  if (Math.abs(v) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v);
  }
  return String(Number(v.toFixed(2)));
}

/** Build a "nice" y-axis domain and evenly spaced ticks from the data. */
function computeYAxis(
  values: number[],
  includeZero: boolean
): { domain: [number, number]; ticks: number[] } {
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const rawStep = (max - min) / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;

  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step / 1000; v += step) {
    ticks.push(Number(v.toFixed(6)));
  }
  return { domain: [niceMin, niceMax], ticks };
}

/** Pick ~9 evenly spaced category labels for the x-axis. */
function pickXTicks(data: FredPoint[]): string[] {
  const n = data.length;
  if (n === 0) return [];
  const count = Math.min(9, n);
  const ticks: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * (n - 1)) / (count - 1));
    const date = data[idx].date;
    if (!ticks.includes(date)) ticks.push(date);
  }
  return ticks;
}

export default function FredChart({
  seriesLabel,
  data,
  yAxisLabel,
  zeroLine = false,
  tintedPlot = false,
}: FredChartProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    const el = cardRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-sm border border-gray-200 bg-white text-sm text-gray-500">
        <span className="mb-1 text-red-500">⚠</span>
        Failed to load FRED data for this series.
      </div>
    );
  }

  const { domain, ticks: yTicks } = computeYAxis(
    data.map((d) => d.value),
    zeroLine
  );
  const xTicks = pickXTicks(data);
  const yWidth =
    Math.max(...yTicks.map((t) => formatYTick(t).length)) * 7 + 8;

  const recession = data.filter(
    (d) => d.date >= RECESSION_START && d.date <= RECESSION_END
  );
  const recStart = recession[0]?.date;
  const recEnd = recession[recession.length - 1]?.date;

  return (
    <div
      ref={cardRef}
      className="fred-card flex h-full flex-col rounded-sm border border-gray-200 bg-white"
    >
      {/* FRED legend strip */}
      <div className="flex items-center gap-2 bg-[#e8f0fb] px-3 py-1.5">
        <span className="font-serif text-sm font-extrabold tracking-tight text-[#26323a]">
          FRED
        </span>
        <svg width="20" height="14" viewBox="0 0 20 14" className="text-[#4778C0]">
          <polyline
            points="0,11 4,7 8,9 12,3 16,5 20,1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="ml-1 flex items-center gap-1.5 truncate text-[11px] font-medium text-[#1f2937]">
          <span className="h-[2px] w-4 shrink-0 bg-[#4778C0]" />
          {seriesLabel}
        </span>
      </div>

      {/* Plot */}
      <div className="min-h-0 flex-1 px-1 py-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <LineChart data={data} margin={{ top: 8, right: 30, bottom: 4, left: 8 }}>
            {tintedPlot && (
              <ReferenceArea
                x1={data[0].date}
                x2={data[data.length - 1].date}
                y1={domain[0]}
                y2={domain[1]}
                fill="#f4f8fd"
                fillOpacity={1}
                ifOverflow="extendDomain"
              />
            )}
            <CartesianGrid vertical={false} stroke="#d7dbe0" strokeWidth={1} />
            {recStart && recEnd && (
              <ReferenceArea
                x1={recStart}
                x2={recEnd}
                y1={domain[0]}
                y2={domain[1]}
                fill="#c9ccd1"
                fillOpacity={0.55}
                ifOverflow="hidden"
              />
            )}
            {zeroLine && <ReferenceLine y={0} stroke="#111827" strokeWidth={1.2} />}
            <XAxis
              dataKey="date"
              ticks={xTicks}
              interval={0}
              tick={{ fontSize: 10, fill: "#374151" }}
              tickLine={false}
              axisLine={{ stroke: "#9ca3af" }}
              tickFormatter={(v: string) => formatMonth(v)}
              minTickGap={0}
            />
            <YAxis
              domain={domain}
              ticks={yTicks}
              tick={{ fontSize: 10, fill: "#374151" }}
              tickLine={false}
              axisLine={{ stroke: "#9ca3af" }}
              tickFormatter={formatYTick}
              width={yWidth}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fontSize: 10,
                        fill: "#374151",
                        textAnchor: "middle",
                      },
                    }
                  : undefined
              }
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={FRED_BLUE}
              strokeWidth={1.6}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between gap-2 px-3 pb-2 pt-1">
        <div className="text-[10px] leading-tight text-[#374151]">
          <div>Source: Federal Reserve Economic Data (FRED®)</div>
          <div className="italic text-[#4778C0]">
            Shaded areas indicate U.S. recessions.
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://fred.stlouisfed.org"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-[#374151] hover:underline"
          >
            fred.stlouisfed.org
          </a>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1 rounded border border-[#4778C0] px-1.5 py-0.5 text-[10px] text-[#4778C0] hover:bg-[#e8f0fb]"
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M0 3V0h3M5 0h3v3M8 5v3H5M3 8H0V5"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
