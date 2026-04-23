import pkg from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const { PrismaClient, Role } = pkg;
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // Seed users
  for (const account of config.defaultAccounts) {
    const role = (account.role as typeof Role[keyof typeof Role]) || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: { password },
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }

  // Seed flyers
   console.log(`Seeding ${config.defaultFlyers.length} flyers...`);
  for (const flyer of config.defaultFlyers) {
    console.log(`  Creating flyer: ${flyer.title}`);
    await prisma.flyer.create({
      data: {
        title: flyer.title,
        description: flyer.description,
        category: flyer.category,
        date: flyer.date,
        location: flyer.location,
        contactInfo: flyer.contactInfo,
        owner: flyer.owner,
        savedBy: flyer.savedBy,
      },
    });
  }
  console.log('Flyers seeded.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });