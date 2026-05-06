'use server';

import { prisma } from '@/lib/prisma';
import { FlyerCategory } from '@prisma/client';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveFlyer(flyerId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { savedBy: { push: session.user.email } },
  });

  revalidatePath(`/flyers/${flyerId}`);
}

export async function unsaveFlyer(flyerId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  const flyer = await prisma.flyer.findUnique({ where: { id: flyerId } });
  if (!flyer) throw new Error('Flyer not found');

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { savedBy: { set: flyer.savedBy.filter(email => email !== session.user.email) } },
  });

  revalidatePath(`/flyers/${flyerId}`);
}

export async function toggleFlyerPrivacy(flyerId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  const flyer = await prisma.flyer.findUnique({ where: { id: flyerId } });
  if (!flyer) throw new Error('Flyer not found');
  if (flyer.owner !== session.user.email) throw new Error('Not authorized');

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { isPrivate: !flyer.isPrivate },
  });

  revalidatePath(`/flyers/${flyerId}`);
  return !flyer.isPrivate;
}

export async function rsvpFlyer(flyerId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { rsvpBy: { push: session.user.email } },
  });

  revalidatePath(`/flyers/${flyerId}`);
}

export async function unrsvpFlyer(flyerId: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  const flyer = await prisma.flyer.findUnique({ where: { id: flyerId } });
  if (!flyer) throw new Error('Flyer not found');

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { rsvpBy: { set: flyer.rsvpBy.filter(email => email !== session.user.email) } },
  });

  revalidatePath(`/flyers/${flyerId}`);
}

export async function editFlyer(flyerId: number, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not logged in');

  const flyer = await prisma.flyer.findUnique({ where: { id: flyerId } });
  if (!flyer) throw new Error('Flyer not found');
  if (flyer.owner !== session.user.email) throw new Error('Not authorized');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = (formData.get('category') as FlyerCategory) ?? FlyerCategory.Other;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const contactInfo = formData.get('contactInfo') as string;
  const isPrivate = formData.get('isPrivate') === 'on';
  const expiresAt = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);

  await prisma.flyer.update({
    where: { id: flyerId },
    data: { title, description, category, date, location, contactInfo, isPrivate, expiresAt },
  });

  revalidatePath(`/flyers/${flyerId}`);
  redirect(`/flyers/${flyerId}`);
}