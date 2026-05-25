import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

export default function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const totals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, total]) => total), 0);

  if (!rows.length) {
    return (
      <div className="glass-panel rounded-lg border-dashed p-8 text-center">
        <div className="mx-auto mb-3 h-16 w-24 rounded-full border border-white/10 bg-white/10" />
        <p className="font-medium text-white">No expense categories yet</p>
        <p className="mt-1 text-sm text-slate-400">Add an expense to see where your money goes.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel space-y-4 rounded-lg p-4">
      {rows.map(([category, total]) => (
        <div key={category}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-200">{category}</span>
            <span className="text-slate-400">{formatCurrency(total)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-rose-300"
              style={{ width: `${Math.max((total / max) * 100, 5)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
