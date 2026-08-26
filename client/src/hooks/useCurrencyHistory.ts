import { useEffect, useState } from "react";
import { currencyApi } from "../services/currencyApi";
import type { HistoryPoint } from "../types/currency";

export function useCurrencyHistory(from: string, to: string, period: number) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!from || !to || from === to) return;
    setLoading(true);
    setError(null);
    void currencyApi.getHistory(from, to, period)
      .then((history) => { if (active) setData(history); })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load history"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [from, to, period]);

  return { data, loading, error };
}
