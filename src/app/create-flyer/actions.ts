'use server';

import { prisma } from '@/lib/prisma';
import { FlyerCategory } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';

export async function createFlyer(formData: FormData) {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as FlyerCategory;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const contactInfo = formData.get('contactInfo') as string;
  const isPrivate = formData.get('isPrivate') === 'on';
  const flyerColor = (formData.get('flyerColor') as string) || '#fff7b3';

  if (!title || !description || !category || !date || !location || !contactInfo) {
    throw new Error('Missing required flyer information.');
  }

  const expiresAt = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);

  const flyer = await prisma.flyer.create({
    data: {
      title,
      description,
      category,
      date,
      location,
      contactInfo,
      owner: session!.user.email!,
      savedBy: [],
      rsvpBy: [],
      isPrivate,
      expiresAt,
      flyerColor,
    },
  });

  redirect(`/flyers/${flyer.id}?created=true`);
}