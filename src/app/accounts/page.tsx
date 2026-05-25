import AccountCard from "@/components/AccountCard";
import { prisma } from "@/lib/prisma";
import type { Account } from "@/types";

export const dynamic = "force-dynamic";

async function getAccounts(): Promise<Account[]> {
  const accounts = await prisma.account.findMany({
    include: { transactions: true },
    orderBy: { id: "asc" },
  });

  return accounts.map((account) => {
    const totalIncome = account.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = account.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      id: account.id,
      name: account.name,
      balance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    };
  });
}

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-5">
      <div>
        <p className="page-kicker">Bank accounts</p>
        <h1 className="page-title">Accounts</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
