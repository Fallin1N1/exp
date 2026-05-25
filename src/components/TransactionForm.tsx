"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { expenseCategories, incomeCategories, type Account, type TransactionType } from "@/types";

const descriptionSuggestions: Record<string, string[]> = {
  Salary: ["Monthly salary", "Bonus", "Incentive"],
  "Startup income": ["Client payment", "Product revenue", "Investor transfer"],
  Freelance: ["Freelance project", "Consulting work", "Design work"],
  "Other income": ["Cashback", "Interest earned", "Gift received"],
  "Daily expenses": ["Groceries", "Household items", "Daily essentials"],
  Bills: ["Electricity bill", "Internet bill", "Mobile recharge"],
  Fuel: ["Petrol", "Diesel", "CNG refill"],
  Food: ["Lunch", "Dinner", "Coffee"],
  Transport: ["Cab ride", "Metro recharge", "Bus ticket"],
  Rent: ["House rent", "Office rent", "Maintenance"],
  EMI: ["Home loan EMI", "Car loan EMI", "Personal loan EMI"],
  Shopping: ["Clothes", "Electronics", "Online order"],
  Entertainment: ["Movie tickets", "Streaming subscription", "Event tickets"],
  Medical: ["Doctor visit", "Medicines", "Health checkup"],
  Other: ["Miscellaneous", "Personal expense", "One-time payment"],
};

export default function TransactionForm() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [type, setType] = useState<TransactionType>("expense");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(expenseCategories[0]);
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = useMemo(
    () => (type === "income" ? incomeCategories : expenseCategories),
    [type],
  );
  const suggestions = useMemo(() => descriptionSuggestions[category] || [], [category]);

  useEffect(() => {
    fetch("/api/accounts")
      .then((response) => response.json())
      .then((data: Account[]) => {
        setAccounts(data);
        setAccountId(String(data[0]?.id || ""));
      })
      .catch(() => setError("Could not load accounts."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(categories[0]);
  }, [categories]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desc,
        amount: Number(amount),
        type,
        category,
        accountId: Number(accountId),
        date,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      setError("Could not save transaction.");
      return;
    }

    setDesc("");
    setAmount("");
    setMessage("Transaction saved successfully.");
    router.refresh();
  }

  if (loading) {
    return <div className="glass-panel h-96 animate-pulse rounded-lg" />;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-4">
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/30 p-1">
        {(["expense", "income"] as TransactionType[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
              type === option
                ? option === "income"
                  ? "bg-emerald-300 text-black"
                  : "bg-rose-300 text-black"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-300">Description</span>
          <input
            required
            list="description-suggestions"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            className="glass-input mt-1 w-full rounded-md px-3 py-2"
            placeholder="Monthly salary"
          />
          <datalist id="description-suggestions">
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDesc(suggestion)}
                className="rounded-md border border-white/10 bg-black px-2.5 py-1 text-xs font-medium text-white shadow-sm shadow-black/40 transition hover:border-white/30 hover:bg-zinc-900"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">Amount in INR</span>
          <input
            required
            min="1"
            step="0.01"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="glass-input mt-1 w-full rounded-md px-3 py-2"
            placeholder="55000"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="glass-input mt-1 w-full rounded-md px-3 py-2"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">Account</span>
          <select
            required
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            className="glass-input mt-1 w-full rounded-md px-3 py-2"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">Date</span>
          <input
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="glass-input mt-1 w-full rounded-md px-3 py-2"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="mt-4 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60"
      >
        <PlusCircle className="h-5 w-5" />
        {saving ? "Saving..." : "Add transaction"}
      </button>
    </form>
  );
}
