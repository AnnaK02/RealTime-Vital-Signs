import { PrismaClient } from '@prisma/client';
import * as seeders from './seeders';

const prisma = new PrismaClient();

async function main() {
  for await (const key of Object.keys(seeders)) {
    console.log(`Seeding ${key}...`);
    const seeder = seeders[key as keyof typeof seeders];
    await seeder(prisma);
    console.log(`Seeding ${key}... [DONE]`);
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });