import type { Currency, HistoryPoint, RateResult } from "../types/currency";

// In production the API is served by the same origin through Caddy (`/api`).
// Keeping localhost as the development default avoids making the browser ask
// for access to local services when the public site is opened.
const API_URL = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "")
).replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const currencyApi = {
  getCurrencies: () => request<Currency[]>("/api/currencies"),
  getRate: (from: string, to: string) => request<RateResult>(`/api/rate?from=${from}&to=${to}`),
  getHistory: (from: string, to: string, period: number) => request<HistoryPoint[]>(`/api/history?from=${from}&to=${to}&period=${period}`),
};
