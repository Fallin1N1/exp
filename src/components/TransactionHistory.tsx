"use client";

import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";
import TransactionItem from "@/components/TransactionItem";
import { invalidateUiCache, invalidateUiCachePrefix, readUiCache, uiCacheKeys, writeUiCache } from "@/lib/ui-cache";
import type { Transaction, TransactionType } from "@/types";

type Filter = "all" | TransactionType;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const query = filter === "all" ? "" : `?type=${filter}`;
    const cacheKey = uiCacheKeys.transactions(filter);
    const cachedTransactions = readUiCache<Transaction[]>(cacheKey);

    setError("");

    if (cachedTransactions) {
      setTransactions(cachedTransactions);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetch(`/api/transactions${query}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch transactions");
        return response.json();
      })
      .then((data: Transaction[]) => {
        const transactions = Array.isArray(data) ? data : [];
        writeUiCache(cacheKey, transactions);
        if (!cancelled) setTransactions(transactions);
      })
      .catch(() => {
        if (!cancelled && !cachedTransactions) setError("Could not load transactions.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function deleteTransaction(id: number) {
    setDeleting(id);
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setDeleting(null);

    if (!response.ok) {
      setError("Could not delete transaction.");
      return;
    }

    invalidateUiCache([uiCacheKeys.accounts]);
    invalidateUiCachePrefix("transactions:");
    setTransactions((current) => {
      const next = current.filter((transaction) => transaction.id !== id);
      writeUiCache(uiCacheKeys.transactions(filter), next);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "income", "expense"] as Filter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === option ? "bg-white text-black" : "glass-control"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error ? <p className="mb-4 rounded-md border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="glass-panel h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : transactions.length ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={deleteTransaction}
              deleting={deleting === transaction.id}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-lg border-dashed p-10 text-center">
          <ReceiptText className="mx-auto h-14 w-14 text-white/45" />
          <p className="mt-4 font-medium text-white">No transactions found</p>
          <p className="mt-1 text-sm text-slate-400">Your matching transactions will appear here.</p>
        </div>
      )}
    </div>
  );
}
