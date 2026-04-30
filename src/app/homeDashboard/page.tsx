import { Major } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { autoExpireFlyers } from '@/lib/autoExpireFlyers';
import PageSwitch from './pageSwitch';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  major: Major;
  image: string;
  role: string;
};

export default async function BoardPage() {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const dbUser = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      fullName: true,
      major: true,
      image: true,
      role: true,
    },
  });

  const user: SessionUser = {
    email: session!.user.email!,
    id: session!.user.id,
    name: dbUser?.fullName || 'User',
    major: dbUser?.major || 'Other',
    image: dbUser?.image || '',
    role: dbUser?.role || 'user',
  };

  await autoExpireFlyers();

  // Flyers the user has saved (exclude private flyers they don't own)
  const savedFlyers = await prisma.flyer.findMany({
    where: { savedBy: { has: session!.user.email! }, isPrivate: false },
  });

  // Flyers the user created (owned by their email)
  const myFlyers = await prisma.flyer.findMany({
    where: { owner: session!.user.email! },
  });

  return (
    <PageSwitch
      user={user}
      savedFlyers={savedFlyers}
      myFlyers={myFlyers}
    />
  );
}