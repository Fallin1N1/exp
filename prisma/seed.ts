import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const accounts = ["SBI Savings", "HDFC Current"];

  for (const [index, name] of accounts.entries()) {
    await prisma.account.upsert({
      where: { id: index + 1 },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
