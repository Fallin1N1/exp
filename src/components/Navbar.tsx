"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, History, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/62 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-white">
            Expense Tracker
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "glass-control flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                    active && "border-white/35 bg-white text-black shadow-lg shadow-white/10",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/70 backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-slate-400 transition",
                  active && "text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
