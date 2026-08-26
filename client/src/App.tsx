import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { ConverterHero } from "./components/converter/ConverterHero";
import { RateHistoryCard } from "./components/chart/RateHistoryCard";
import { StatsGrid } from "./components/stats/StatsGrid";
import { useCurrencyHistory } from "./hooks/useCurrencyHistory";
import { useCurrencyRate } from "./hooks/useCurrencyRate";
import { currencyApi } from "./services/currencyApi";
import type { Currency } from "./types/currency";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("currency-tracker:theme") === "dark");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [editingSide, setEditingSide] = useState<"base" | "quote">("base");
  const [period, setPeriod] = useState(7);
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const { data: rate, loading: rateLoading, error: rateError } = useCurrencyRate(base, quote);
  const { data: history, loading: historyLoading, error: historyError } = useCurrencyHistory(base, quote, period);
  const { data: monthHistory } = useCurrencyHistory(base, quote, 30);

  useEffect(() => {
    if (!rate || editingSide !== "base") return;
    const numericAmount = Number(amount);
    setConvertedAmount(Number.isFinite(numericAmount) && amount !== "" ? (numericAmount * rate.rate).toFixed(2) : "");
  }, [amount, editingSide, rate]);

  useEffect(() => {
    if (!rate || editingSide !== "quote") return;
    const numericConverted = Number(convertedAmount);
    setAmount(Number.isFinite(numericConverted) && convertedAmount !== "" ? (numericConverted / rate.rate).toFixed(2) : "");
  }, [convertedAmount, editingSide, rate]);

  useEffect(() => {
    void currencyApi.getCurrencies().then(setCurrencies).catch((error: unknown) => setCurrencyError(error instanceof Error ? error.message : "Unable to load currencies"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("currency-tracker:theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const sanitizeAmount = (value: string) => value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const handleAmountChange = (value: string) => {
    const nextAmount = sanitizeAmount(value);
    setEditingSide("base");
    setAmount(nextAmount);
    if (rate && nextAmount !== "") setConvertedAmount((Number(nextAmount) * rate.rate).toFixed(2));
    if (nextAmount === "") setConvertedAmount("");
  };
  const handleConvertedAmountChange = (value: string) => {
    const nextConverted = sanitizeAmount(value);
    setEditingSide("quote");
    setConvertedAmount(nextConverted);
    if (rate && nextConverted !== "") setAmount((Number(nextConverted) / rate.rate).toFixed(2));
    if (nextConverted === "") setAmount("");
  };
  const handleBaseChange = (value: string) => { setEditingSide("base"); setBase(value); };
  const handleQuoteChange = (value: string) => { setEditingSide("base"); setQuote(value); };
  const swap = () => { setEditingSide("base"); setBase(quote); setQuote(base); };
  const error = currencyError ?? rateError;

  return <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <Header darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)} />
    <main className="mx-auto max-w-[1440px] space-y-8 px-5 py-8 lg:px-9 lg:py-10">
    {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
    <ConverterHero base={base} quote={quote} amount={amount} convertedAmount={convertedAmount} currencies={currencies} rate={rate} loading={rateLoading} onBaseChange={handleBaseChange} onQuoteChange={handleQuoteChange} onAmountChange={handleAmountChange} onConvertedAmountChange={handleConvertedAmountChange} onSwap={swap} />
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]"><RateHistoryCard base={base} quote={quote} period={period} data={history} loading={historyLoading} error={historyError} onPeriodChange={setPeriod} /><StatsGrid data={monthHistory} date={rate?.date} /></section>
    </main>
  </div>;
}

export default App;
