import { ArrowUpRight, Clock3 } from "lucide-react";

export function StatCard({ title, value, detail, neutral = false }: { title: string; value: string; detail: string; neutral?: boolean }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${neutral ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"}`}>{neutral ? <Clock3 size={22} /> : <ArrowUpRight size={22} />}</span><span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span></div><p className={`mt-5 text-2xl font-semibold ${neutral ? "text-slate-900 dark:text-white" : "text-emerald-700 dark:text-emerald-400"}`}>{value}</p><p className="mt-2 text-sm text-slate-400">{detail}</p></div>;
}
