import { useCallback, useEffect, useState } from "react";
import { currencyApi } from "../services/currencyApi";
import type { RateResult } from "../types/currency";

export function useCurrencyRate(from: string, to: string) {
  const [data, setData] = useState<RateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!from || !to || from === to) return;
    setLoading(true);
    setError(null);
    try {
      setData(await currencyApi.getRate(from, to));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load exchange rate");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { void reload(); }, [reload]);

  return { data, loading, error, reload };
}
