import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Currency } from "../../types/currency";

const flags: Record<string, string> = {
  AED: "🇦🇪", AUD: "🇦🇺", AZN: "🇦🇿", CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳",
  EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", KZT: "🇰🇿", RUB: "🇷🇺",
  TRY: "🇹🇷", USD: "🇺🇸",
};

export function CurrencyDropdown({ value, currencies, onChange }: { value: string; currencies: Currency[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = currencies.find((currency) => currency.code === value);
  const filtered = currencies.filter((currency) => `${currency.code} ${currency.name}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const close = (event: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const selectCurrency = (code: string) => { onChange(code); setOpen(false); setQuery(""); };
  return <div ref={wrapperRef} className="relative w-full shrink-0"><button type="button" onClick={() => setOpen((current) => !current)} className={`flex w-full min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${open ? "border-blue-500 bg-blue-50/60 ring-4 ring-blue-100 dark:bg-blue-950/50 dark:ring-blue-950" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"}`} aria-haspopup="listbox" aria-expanded={open}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base">{flags[value] ?? "¤"}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold tracking-wide text-slate-800 dark:text-slate-100">{value}</span><span className="block max-w-full truncate text-[10px] text-slate-400">{selected?.name ?? "Choose currency"}</span></span><ChevronDown size={15} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180 text-blue-600" : ""}`} /></button>{open ? <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30" role="listbox"><div className="relative mb-2"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search currency..." className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950" /></div><div className="max-h-64 overflow-y-auto pr-1">{filtered.length ? filtered.map((currency) => <button type="button" role="option" aria-selected={currency.code === value} key={currency.code} onClick={() => selectCurrency(currency.code)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${currency.code === value ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-base dark:bg-slate-700">{flags[currency.code] ?? "¤"}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{currency.code}</span><span className="block truncate text-xs text-slate-400">{currency.name}</span></span>{currency.code === value ? <Check size={17} className="text-blue-600" /> : null}</button>) : <p className="px-3 py-6 text-center text-sm text-slate-400">Currency not found</p>}</div></div> : null}</div>;
}
