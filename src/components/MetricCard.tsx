import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: "blue" | "green" | "red" | "slate";
}

const tones = {
  blue: "bg-blue-400/15 text-blue-200",
  green: "bg-emerald-400/15 text-emerald-200",
  red: "bg-rose-400/15 text-rose-200",
  slate: "bg-white/10 text-slate-100",
};

export default function MetricCard({ title, value, icon: Icon, tone }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(value)}</p>
        </div>
        <span className={cn("rounded-md border border-white/10 p-2", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
