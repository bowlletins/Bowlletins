import { prisma } from '../src/lib/prisma'; // ← fixed path only
import { Role, Major, FlyerCategory } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database...');
  const password = await hash('changeme', 10);

  // Seed users (kept your version with full fields)
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    const major = (account.major as Major) || Major.Other;
    const fullName = account.fullName || 'New User';
    const username = account.email.split('@')[0];

    console.log(`  Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        username,
        fullName,
        major,
      },
      create: {
        email: account.email,
        username,
        password,
        role,
        fullName,
        major,
      },
    });
  }

  // Seed flyers (kept your logic)
  console.log(`Seeding ${config.defaultFlyers.length} flyers...`);
  for (const flyer of config.defaultFlyers) {
    const category = (flyer.category as FlyerCategory) || FlyerCategory.Other;

    console.log(`  Creating flyer: ${flyer.title} with category: ${category}`);

    await prisma.flyer.create({
      data: {
        title: flyer.title,
        description: flyer.description,
        category,
        date: flyer.date,
        location: flyer.location,
        contactInfo: flyer.contactInfo,
        owner: flyer.owner,
        savedBy: flyer.savedBy ?? [], // ← FIXED casing only
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