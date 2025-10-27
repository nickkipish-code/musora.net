import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // minimal production seed: create an admin user and a sample zone/tariff
  await prisma.user.upsert({ where: { email: 'admin@museum.local' }, update: {}, create: { email: 'admin@museum.local', name: 'Admin' } });
  await prisma.zone.upsert({ where: { id: 'zone-1' }, update: {}, create: { id: 'zone-1', name: 'Central', polygon: [], city: 'City' } as any });
  await prisma.tariff.upsert({ where: { id: 'tariff-1' }, update: {}, create: { id: 'tariff-1', zoneId: 'zone-1', basePrice: 100, perFloor: 20 } as any });
  console.log('Production seed complete');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());


