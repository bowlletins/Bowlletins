import { prisma } from './lib/prisma';
import { Role, Major} from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database...');
  const password = await hash('changeme', 10);

  // Seed users
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    const major = (account.major as Major) || Major.Other;
    const fullName = account.fullName || 'New User';

    console.log(`  Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        fullName,
        major,
      },
      create: {
        email: account.email,
        password,
        role,
        fullName,
        major,
      },
    });
  }

  // Seed flyers
  console.log(`Seeding ${config.defaultFlyers.length} flyers...`);
  for (const flyer of config.defaultFlyers) {
    const category = (flyer.category) || 'Other';
    const savedby = flyer.savedBy || [];

    console.log(`  Creating flyer: ${flyer.title} with category: ${category}`);

    await prisma.flyer.upsert({
      where: { id: config.defaultFlyers.indexOf(flyer) + 1 },
      update: {
        title: flyer.title,
        description: flyer.description,
        category,
        date: flyer.date,
        location: flyer.location,
        contactInfo: flyer.contactInfo,
        owner: flyer.owner,
        savedby,
      },
      create: {
        title: flyer.title,
        description: flyer.description,
        category,
        date: flyer.date,
        location: flyer.location,
        contactInfo: flyer.contactInfo,
        owner: flyer.owner,
        savedby,
      },
    });
  }
  console.log('Flyers seeded.');
}

main()
  .then(() => {
    console.log('Seeding complete!');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
