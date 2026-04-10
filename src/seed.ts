import { prisma } from './lib/prisma';
import { Role, Major } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database...');
  const password = await hash('changeme', 10);

  // Use for...of loop for Users to ensure mandatory fields are handled correctly
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    
    // Pulling mandatory fields from your JSON
    // If the JSON is missing them, it uses 'Other' and 'New User' as fallbacks
    const major = (account.major as Major) || Major.Other; 
    const fullName = account.fullName || 'New User';

    console.log(`  Creating user: ${account.email} with role: ${role}`);

    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        fullName, // Update existing users with name
        major,    // Update existing users with major
      },
      create: {
        email: account.email,
        password,
        role,
        fullName, // Required by your new schema
        major,    // Required by your new schema
      },
    });
  }

  /* // COMMENTED OUT: Old 'Stuff' seeding section
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
     
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
  */
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


/*
async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
     
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
}


main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
*/