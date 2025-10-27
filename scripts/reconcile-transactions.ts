import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tx = await prisma.transaction.findMany({ where: {}, take: 200 });
  for (const t of tx) {
    // placeholder: check external payment provider status and reconcile
    console.log('Checking tx', t.id, t.orderId, t.amount);
  }
  await prisma.$disconnect();
}

main().catch((e)=>{ console.error(e); process.exit(1); });


