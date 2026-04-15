'use server';

import { Major} from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function createUser(credentials: {
  fullName: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const hashedPassword = await hash(credentials.password, 10);
  const displayName = credentials.fullName?.trim() || 'User';

  await prisma.user.create({
    data: {
      email: credentials.email,
      password: hashedPassword,
      fullName: displayName,
      major: 'Other'as Major,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.fullName)}&background=random&color=fff&size=128`,
      role: 'USER',
    },
  });
  redirect('/auth/signin');
}

export async function updateProfile(data: { 
  email: string;
  fullName?: string| null; 
  major?: Major|null;
  image?: string | null;
}) {
  if (!data.email) return;

  const updates: { 
    fullName?: string; 
    major?: Major; 
    image?: string | null 
  } = {};

  if (data.fullName !== undefined && data.fullName !==null){
    updates.fullName = data.fullName;
  } 
  if (data.major !== undefined && data.major !== null) {
    updates.major = data.major;
  }
  if (data.image !== undefined) {
    updates.image = data.image;
  }

  await prisma.user.update({
    where: { email: data.email },
    data: updates,
  });

  revalidatePath('/homeDashboard');
}


/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

