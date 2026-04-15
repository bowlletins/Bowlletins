import { Major } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import ProfileSettings from './ProfileSettings';

type SessionUser = {
  email: string;
  id: string;
  name: string;
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
  const user = session?.user as unknown as SessionUser;
  return <ProfileSettings user={user} />;
}
