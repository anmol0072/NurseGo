import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding extra services for Diagnostic and Care categories...');

  const extraServices = [
    { name: 'Blood Sample Collection', basePrice: 500, baseDistance: 5, extraPerKm: 10, taxRate: 0.18 },
    { name: 'ECG Test at Home', basePrice: 1200, baseDistance: 4, extraPerKm: 15, taxRate: 0.18 },
    { name: 'Elderly Care (12h)', basePrice: 2500, baseDistance: 10, extraPerKm: 20, taxRate: 0.18 },
    { name: 'Physiotherapy Session', basePrice: 1500, baseDistance: 5, extraPerKm: 15, taxRate: 0.18 }
  ];

  const existing = await prisma.service.findMany();
  const existingNames = existing.map(s => s.name);

  let added = 0;
  for (const s of extraServices) {
    if (!existingNames.includes(s.name)) {
      await prisma.service.create({ data: s });
      console.log(`Added: ${s.name}`);
      added++;
    } else {
      console.log(`Skipped (already exists): ${s.name}`);
    }
  }

  console.log(`Finished! Added ${added} new services.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
