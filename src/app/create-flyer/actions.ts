'use server';

import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function createFlyer(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as Category;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const contactInfo = formData.get('contactInfo') as string;

  const flyer = await prisma.flyer.create({
    data: {
      title,
      description,
      category,
      date,
      location,
      contactInfo,
      owner: 'anonymous',
      savedBy: [],
    },
  });

  redirect(`/flyers/${flyer.id}`);
}