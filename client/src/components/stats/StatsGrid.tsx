import type { HistoryPoint } from "../../types/currency";
import { StatCard } from "./StatCard";

function change(data: HistoryPoint[]) {
  if (data.length < 2) return { percent: "—", absolute: "—" };
  const first = data[0].rate;
  const latest = data[data.length - 1].rate;
  const percentage = ((latest - first) / first) * 100;
  return { percent: `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`, absolute: `${latest - first >= 0 ? "+" : ""}${(latest - first).toFixed(4)}` };
}

export function StatsGrid({ data, date }: { data: HistoryPoint[]; date?: string }) {
  const daily = change(data.slice(-2));
  const weekly = change(data.slice(-8));
  const monthly = change(data);
  return <div className="grid gap-5 sm:grid-cols-2"><StatCard title="Daily Change" value={daily.percent} detail={daily.absolute} /><StatCard title="Weekly Change" value={weekly.percent} detail={weekly.absolute} /><StatCard title="Monthly Change" value={monthly.percent} detail={monthly.absolute} /><StatCard title="Last Update" value={date ?? "—"} detail="Frankfurter reference rate" neutral /></div>;
}
