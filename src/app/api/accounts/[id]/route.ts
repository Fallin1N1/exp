import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid account ID" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Account name is required" }, { status: 400 });
    }

    const exists = await prisma.account.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const account = await prisma.account.update({ where: { id }, data: { name } });
    return NextResponse.json(account, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
