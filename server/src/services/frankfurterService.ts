import type { Currency, HistoryPoint, RateResult } from "../types/currency.js";

const API_BASE = "https://api.frankfurter.dev/v2";

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Frankfurter request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function getCurrencies(): Promise<Currency[]> {
  const payload = await requestJson<Record<string, string> | Currency[]>("/currencies");
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        const value = item as Currency & { iso_code?: string };
        return { code: value.code ?? value.iso_code ?? "", name: value.name };
      })
      .filter((item) => item.code && item.name)
      .sort((a, b) => a.code.localeCompare(b.code));
  }
  return Object.entries(payload)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export async function getRate(from: string, to: string): Promise<RateResult> {
  const payload = await requestJson<{ date: string; base: string; quote: string; rate: number }>(
    `/rate/${from}/${to}`,
  );
  return { from: payload.base, to: payload.quote, rate: payload.rate, date: payload.date };
}

export async function getHistory(from: string, to: string, startDate: string, endDate: string): Promise<HistoryPoint[]> {
  const payload = await requestJson<
    | Array<{ date: string; rate: number; base?: string; quote?: string }>
    | { rates?: Record<string, Record<string, number>> }
  >(`/rates?base=${from}&quotes=${to}&from=${startDate}&to=${endDate}`);

  if (Array.isArray(payload)) {
    return payload
      .map((point) => ({ date: point.date, rate: Number(point.rate) }))
      .filter((point) => Number.isFinite(point.rate))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  return Object.entries(payload.rates ?? {})
    .map(([date, values]) => ({ date, rate: Number(values[to]) }))
    .filter((point) => Number.isFinite(point.rate))
    .sort((a, b) => a.date.localeCompare(b.date));
}
