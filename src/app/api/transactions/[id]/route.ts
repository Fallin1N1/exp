import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
