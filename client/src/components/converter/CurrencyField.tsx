import type { Currency } from "../../types/currency";
import { CurrencyDropdown } from "./CurrencyDropdown";

type Props = { label: string; amount: string; code: string; currencies: Currency[]; onAmountChange: (value: string) => void; onCurrencyChange: (value: string) => void };

export function CurrencyField({ label, amount, code, currencies, onAmountChange, onCurrencyChange }: Props) {
  const name = currencies.find((currency) => currency.code === code)?.name ?? code;
  return <div><p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="grid grid-cols-[minmax(0,1fr)_minmax(120px,42%)] items-center gap-4"><input value={amount} onChange={(event) => onAmountChange(event.target.value)} inputMode="decimal" className="min-w-0 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-2xl font-semibold tracking-tight text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-900 dark:focus:ring-blue-950" aria-label={label} /><CurrencyDropdown value={code} currencies={currencies} onChange={onCurrencyChange} /></div><p className="mt-3 text-sm text-slate-400">{name}</p></div></div>;
}
