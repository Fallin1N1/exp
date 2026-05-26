"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Wallet, X } from "lucide-react";
import { invalidateUiCache, invalidateUiCachePrefix, uiCacheKeys } from "@/lib/ui-cache";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/types";

export default function AccountCard({ account }: { account: Account }) {
  const router = useRouter();
  const [name, setName] = useState(account.name);
  const [draft, setDraft] = useState(account.name);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveName() {
    setSaving(true);
    setError("");
    const response = await fetch(`/api/accounts/${account.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: draft }),
    });
    setSaving(false);

    if (!response.ok) {
      setError("Could not rename account.");
      return;
    }

    setName(draft.trim());
    setEditing(false);
    invalidateUiCache([uiCacheKeys.accounts]);
    invalidateUiCachePrefix("transactions:");
    router.refresh();
  }

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-md border border-white/10 bg-white/10 p-2 text-white">
            <Wallet className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {editing ? (
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="glass-input w-full rounded-md px-2 py-1 text-sm font-medium"
              />
            ) : (
              <h2 className="truncate font-semibold text-white">{name}</h2>
            )}
            {error ? <p className="mt-1 text-xs text-rose-300">{error}</p> : null}
          </div>
        </div>
        {editing ? (
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Save account name"
              onClick={saveName}
              disabled={saving}
              className="rounded-md p-2 text-emerald-200 transition hover:bg-emerald-400/15 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Cancel rename"
              onClick={() => {
                setDraft(name);
                setEditing(false);
              }}
              className="rounded-md p-2 text-slate-300 transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Rename account"
            onClick={() => setEditing(true)}
            className="rounded-md p-2 text-slate-300 transition hover:bg-white/10"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Balance</p>
          <p className="mt-1 font-semibold text-white">{formatCurrency(account.balance)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Income</p>
          <p className="mt-1 font-semibold text-emerald-200">{formatCurrency(account.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Expenses</p>
          <p className="mt-1 font-semibold text-rose-200">{formatCurrency(account.totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
}
