import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@museum.dev' },
    update: {},
    create: {
      email: 'admin@museum.dev',
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: '$2b$10$example', // mock hash
    },
  });

  // Create test users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Client',
      phone: '+380501234567',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Courier',
      phone: '+380501234568',
      role: 'COURIER',
    },
  });

  // Create courier
  const courier = await prisma.courier.upsert({
    where: { userId: bob.id },
    update: {},
    create: {
      userId: bob.id,
      verified: true,
      rating: 4.8,
      vehicle: 'Car',
    },
  });

  // Create addresses
  const address1 = await prisma.address.create({
    data: {
      userId: alice.id,
      label: 'Home',
      street: 'Khreshchatyk St, 1',
      city: 'Kyiv',
      lat: 50.4501,
      lng: 30.5234,
      floor: 5,
      intercom: '123',
      comment: '3rd entrance',
    },
  });

  // Create zone and tariff
  const zone = await prisma.zone.create({
    data: {
      name: 'Kyiv Center',
      city: 'Kyiv',
      polygon: [
        { lat: 50.40, lng: 30.45 },
        { lat: 50.50, lng: 30.45 },
        { lat: 50.50, lng: 30.60 },
        { lat: 50.40, lng: 30.60 },
      ],
      tariff: {
        create: {
          basePrice: 20000, // 200 UAH in cents
          perFloor: 500, // 5 UAH per floor
        },
      },
    },
  });

  // Create promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME10',
        amount: 5000, // 50 UAH
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FIRST50',
        amount: 10000, // 100 UAH
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Create test orders
  const order1 = await prisma.order.create({
    data: {
      userId: alice.id,
      addressId: address1.id,
      type: 'STANDARD',
      floor: 5,
      status: 'PENDING',
      price: 22500, // base 200 + floor 5*5 = 225 UAH
      commission: 2250, // 10%
      lat: 50.4501,
      lng: 30.5234,
      comment: 'Please knock loudly',
      timeline: {
        created: new Date().toISOString(),
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: alice.id,
      addressId: address1.id,
      type: 'BULKY',
      floor: 3,
      courierId: courier.id,
      status: 'EN_ROUTE',
      price: 21500,
      commission: 2150,
      lat: 50.4510,
      lng: 30.5240,
      timeline: {
        created: new Date(Date.now() - 3600000).toISOString(),
        assigned: new Date(Date.now() - 1800000).toISOString(),
        enRoute: new Date(Date.now() - 300000).toISOString(),
      },
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.courier.count()} couriers`);
  console.log(`Created ${await prisma.address.count()} addresses`);
  console.log(`Created ${await prisma.order.count()} orders`);
  console.log(`Created ${await prisma.promoCode.count()} promo codes`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


