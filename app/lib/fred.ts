// Fetches FRED series straight from the public fredgraph CSV endpoint.
// This endpoint does not require an API key. Server-only module.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { unstable_cache } from "next/cache";
import type { FredPoint } from "./fredFormat";

const execFileAsync = promisify(execFile);

export type { FredPoint } from "./fredFormat";

function buildUrl(seriesId: string, startDate: string): string {
  return `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(
    seriesId
  )}&cosd=${startDate}`;
}

/**
 * Download a FRED CSV.
 *
 * Primary path is the platform `fetch`, which works in normal deployments.
 * Some networks (including sandboxes fronted by strict CDN bot-management)
 * drop Node/undici's TLS handshake while still allowing the system `curl`
 * binary, so we fall back to `curl` if `fetch` fails or times out.
 */
async function downloadCsv(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "text/csv" },
      signal: AbortSignal.timeout(4_000),
    });
    if (res.ok) {
      const text = await res.text();
      if (text.includes(",")) return text;
    }
  } catch {
    // fall through to curl
  }

  const { stdout } = await execFileAsync(
    "curl",
    ["-s", "--max-time", "25", url],
    { maxBuffer: 16 * 1024 * 1024 }
  );
  return stdout;
}

function parseCsv(text: string): FredPoint[] {
  const lines = text.trim().split("\n").slice(1); // drop header row
  const points: FredPoint[] = [];
  for (const line of lines) {
    const [date, raw] = line.split(",");
    if (!date || raw === undefined || raw === "" || raw === ".") continue;
    const value = Number(raw);
    if (Number.isNaN(value)) continue;
    points.push({ date, value });
  }
  return points;
}

/**
 * Download and parse a FRED series as observation points.
 * Results are cached for a day (FRED updates infrequently).
 */
export const fetchFredSeries = unstable_cache(
  async (
    seriesId: string,
    startDate = "2020-01-01"
  ): Promise<FredPoint[]> => {
    const text = await downloadCsv(buildUrl(seriesId, startDate));
    const points = parseCsv(text);
    if (points.length === 0) {
      throw new Error(`No observations returned for ${seriesId}`);
    }
    return points;
  },
  ["fred-series"],
  { revalidate: 60 * 60 * 24 }
);
