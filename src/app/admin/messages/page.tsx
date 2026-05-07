import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import Link from 'next/link';
import AnnouncementManager from '@/components/AnnouncementManager';

export default async function AdminMessagesPage() {
  const session = await auth();

  adminProtectedPage(
    session as { user: { email: string; id: string; name: string; role?: string } } | null,
  );

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serialized = announcements.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="admin-page-bg">
      <div className="admin-content-card">
        <div className="admin-messages-header">
          <div>
            <h1 className="admin-page-title">📢 Announcements</h1>
            <p className="admin-page-subtitle">
              Compose and manage announcements sent to all users
            </p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-view">
            ← Back to Dashboard
          </Link>
        </div>

        <AnnouncementManager announcements={serialized} />
      </div>
    </div>
  );
}
