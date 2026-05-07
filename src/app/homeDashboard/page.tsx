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
  username: string;
  useFullNameDisplay: boolean;
  major: Major;
  image: string;
  role: string;
};

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const { tab } = await searchParams;

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const dbUser = await prisma.user.findUnique({
    where: { email: session!.user.email! },
select: {
  fullName: true,
  username: true,
  useFullNameDisplay: true,
  major: true,
  image: true,
  role: true,
},
  });

const user: SessionUser = {
  email: session!.user.email!,
  id: session!.user.id,
  name: dbUser?.fullName || 'User',
  username: dbUser?.username || 'User',
  useFullNameDisplay: dbUser?.useFullNameDisplay ?? false,
  major: dbUser?.major || 'Other',
  image: dbUser?.image || '',
  role: dbUser?.role || 'user',
};

  await autoExpireFlyers();

  const savedFlyers = await prisma.flyer.findMany({
    where: { savedBy: { has: session!.user.email! }, isPrivate: false },
  });

  const myFlyers = await prisma.flyer.findMany({
    where: { owner: session!.user.email! },
  });

  const expiredFlyers = await prisma.flyer.findMany({
    where: {
      owner: session!.user.email!,
      expiresAt: { lt: new Date() },
    },
  });

  return (
    <PageSwitch
      user={user}
      savedFlyers={savedFlyers}
      myFlyers={myFlyers}
      expiredFlyers={expiredFlyers}
      initialTab={tab || 'home'}
    />
  );
}