import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: { transactions: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      accounts.map((account) => {
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
      }),
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Account name is required" }, { status: 400 });
    }

    const account = await prisma.account.create({ data: { name } });
    return NextResponse.json(account, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
