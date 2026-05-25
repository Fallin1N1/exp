import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/types";

const validTypes = new Set(["income", "expense"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const accountId = searchParams.get("accountId");

    const transactions = await prisma.transaction.findMany({
      where: {
        ...(type && validTypes.has(type) ? { type } : {}),
        ...(accountId ? { accountId: Number(accountId) } : {}),
      },
      include: { account: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(
      transactions.map((transaction) => ({
        id: transaction.id,
        desc: transaction.desc,
        amount: transaction.amount,
        type: transaction.type as TransactionType,
        category: transaction.category,
        date: transaction.date.toISOString(),
        accountId: transaction.accountId,
        accountName: transaction.account.name,
      })),
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const desc = String(body.desc || "").trim();
    const amount = Number(body.amount);
    const type = String(body.type || "") as TransactionType;
    const category = String(body.category || "").trim();
    const accountId = Number(body.accountId);
    const date = new Date(body.date);

    if (!desc || !category || !validTypes.has(type) || amount <= 0 || Number.isNaN(date.valueOf())) {
      return NextResponse.json({ error: "Invalid transaction details" }, { status: 400 });
    }

    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: { desc, amount, type, category, accountId, date },
      include: { account: true },
    });

    return NextResponse.json(
      {
        id: transaction.id,
        desc: transaction.desc,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.toISOString(),
        accountId: transaction.accountId,
        accountName: transaction.account.name,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
