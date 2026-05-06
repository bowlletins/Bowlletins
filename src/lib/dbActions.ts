'use server';

import { Major } from '@prisma/client';
import { hash } from 'bcrypt';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function createUser(credentials: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}) {
  const cleanUsername = credentials.username.trim().toLowerCase();

  if (!cleanUsername) {
    throw new Error('Username is required.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: cleanUsername },
  });

  if (existingUsername) {
    throw new Error('Username is already taken.');
  }

  const hashedPassword = await hash(credentials.password, 10);
  const displayName = credentials.fullName?.trim() || 'User';

  await prisma.user.create({
    data: {
      email: credentials.email,
      username: cleanUsername,
      password: hashedPassword,
      fullName: displayName,
      major: 'Other' as Major,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName,
      )}&background=random&color=fff&size=128`,
      role: 'USER',
    },
  });
}

export async function updateProfile(data: {
  email: string;
  username?: string | null;
  fullName?: string | null;
  useFullNameDisplay?: boolean;
  major?: Major | null;
  image?: string | null;
}) {
  if (!data.email) return;

  const currentUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!currentUser) {
    throw new Error('User not found.');
  }

  const updates: {
    username?: string;
    usernameUpdatedAt?: Date;
    fullName?: string;
    useFullNameDisplay?: boolean;
    major?: Major;
    image?: string | null;
  } = {};

  if (data.username !== undefined && data.username !== null) {
    const newUsername = data.username.trim().toLowerCase();

    if (!newUsername) {
      throw new Error('Username is required.');
    }

    if (newUsername !== currentUser.username) {
      if (currentUser.usernameUpdatedAt) {
        const now = new Date();
        const daysSinceLastChange =
          (now.getTime() - currentUser.usernameUpdatedAt.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastChange < 30) {
          const daysLeft = Math.ceil(30 - daysSinceLastChange);
          throw new Error(`You can change your username again in ${daysLeft} day(s).`);
        }
      }

      const existingUsername = await prisma.user.findUnique({
        where: { username: newUsername },
      });

      if (existingUsername && existingUsername.email !== data.email) {
        throw new Error('Username is already taken.');
      }

      updates.username = newUsername;
      updates.usernameUpdatedAt = new Date();
    }
  }

  if (data.fullName !== undefined && data.fullName !== null) {
    updates.fullName = data.fullName;
  }

  if (data.useFullNameDisplay !== undefined) {
    updates.useFullNameDisplay = data.useFullNameDisplay;
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
  revalidatePath('/profile');
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /[0-9]/.test(password)
    && /[^A-Za-z0-9]/.test(password)
  );
}

export async function changePassword(credentials: {
  email: string;
  password: string;
}) {
  if (!isStrongPassword(credentials.password)) {
    throw new Error(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
    );
  }

  const password = await hash(credentials.password, 10);

  await prisma.user.update({
    where: { email: credentials.email },
    data: { password },
  });
}