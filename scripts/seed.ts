import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const store = await prisma.store.upsert({
    where: { id: 'demo' },
    update: {},
    create: {
      id: 'demo',
      name: 'Sonora Demo Store',
      description: 'A demo store showcasing voice-first accessible shopping',
      ownerId: 'demo-owner',
    },
  });

  console.log('✅ Created demo store:', store.name);

  const products = [
    { name: 'Premium Wireless Headphones', description: 'Noise-cancelling headphones with 30-hour battery', price: 79.99, inStock: true, storeId: 'demo' },
    { name: 'Budget Bluetooth Headphones', description: 'Affordable wireless headphones with great sound', price: 45.99, inStock: true, storeId: 'demo' },
    { name: 'Gaming Headset', description: 'Professional gaming headset with RGB lighting', price: 89.99, inStock: true, storeId: 'demo' },
    { name: 'Sports Earbuds', description: 'Waterproof wireless earbuds for workouts', price: 59.99, inStock: true, storeId: 'demo' },
    { name: 'Comfort Hoodie', description: 'Soft cotton hoodie in multiple colors', price: 34.99, inStock: true, storeId: 'demo' },
    { name: 'Zip-Up Hoodie', description: 'Classic zip-up hoodie with pockets', price: 29.99, inStock: true, storeId: 'demo' },
    { name: 'Oversized Hoodie', description: 'Trendy oversized fleece hoodie', price: 39.99, inStock: true, storeId: 'demo' },
    { name: 'USB-C Fast Charger', description: 'Quick charging adapter with multiple ports', price: 24.99, inStock: true, storeId: 'demo' },
    { name: 'Wireless Phone Charger', description: 'Fast wireless Qi charging pad', price: 29.99, inStock: true, storeId: 'demo' },
    { name: 'Bluetooth Speaker', description: 'Waterproof speaker with 12-hour battery', price: 49.99, inStock: true, storeId: 'demo' },
    { name: 'Ergonomic Mouse Pad', description: 'Gel wrist rest mouse pad', price: 14.99, inStock: true, storeId: 'demo' },
    { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand', price: 34.99, inStock: true, storeId: 'demo' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: 69.99, inStock: true, storeId: 'demo' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log('\n🎉 Database seeded!');
  console.log(`   Products: ${products.length}`);
  console.log(`   URL: http://localhost:3000/store/demo`);
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
