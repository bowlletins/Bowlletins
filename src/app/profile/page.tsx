import { Major } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileSettings from './ProfileSettings';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  username: string;
  usernameUpdatedAt?: string | Date | null;
  useFullNameDisplay?: boolean;
  major: Major;
  image: string;
};

export default async function ProfilePage() {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const dbUser = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      usernameUpdatedAt: true,
      useFullNameDisplay: true,
      major: true,
      image: true,
    },
  });

  if (!dbUser) {
    return null;
  }

  const user: SessionUser = {
    email: dbUser.email,
    id: dbUser.id.toString(),
    name: dbUser.fullName ?? '',
    username: dbUser.username,
    usernameUpdatedAt: dbUser.usernameUpdatedAt,
    useFullNameDisplay: dbUser.useFullNameDisplay,
    major: dbUser.major ?? 'Other',
    image: dbUser.image ?? '/defaultpfp.png',
  };

  return <ProfileSettings user={user} />;
}