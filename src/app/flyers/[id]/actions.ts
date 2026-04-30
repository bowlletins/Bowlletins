'use server';

import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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