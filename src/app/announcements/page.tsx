import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'] });

const NOTE_COLORS = [
  { cls: 'annc-note-yellow', rotate: -2 },
  { cls: 'annc-note-green', rotate: 1.5 },
  { cls: 'annc-note-blue', rotate: -1 },
  { cls: 'annc-note-pink', rotate: 2 },
  { cls: 'annc-note-lavender', rotate: -1.5 },
];

const PIN_COLORS = ['pin-annc-green', 'pin-annc-red', 'pin-annc-blue', 'pin-annc-yellow'];

export default async function AnnouncementsPage() {
  const session = await auth();

  loggedInProtectedPage(
    session as { user: { email: string; id: string; name: string } } | null,
  );

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="annc-page-bg">
      <div className="annc-page-inner">
        {/* Header note */}
        <div className="annc-header-note">
          <div className="annc-header-pin" />
          <div className="flyer-note-corner-rainbow" />
          <h1 className={`annc-header-title ${caveat.className}`}>📢 Announcements</h1>
          <p className="annc-header-subtitle">
            Official updates and news from the Bow-lletins team
          </p>
        </div>

        {announcements.length === 0 ? (
          <div
            className={`annc-empty-note ${caveat.className}`}
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            <div className="pin" style={{ background: 'radial-gradient(circle, #5a8a5a, #2d4a2d)' }} />
            <p>No announcements yet.</p>
            <p style={{ fontSize: '1rem', opacity: 0.7 }}>Check back soon! 👀</p>
          </div>
        ) : (
          <div className="annc-grid">
            {announcements.map((a, i) => {
              const { cls, rotate } = NOTE_COLORS[i % NOTE_COLORS.length];
              const pinCls = PIN_COLORS[i % PIN_COLORS.length];
              const date = new Date(a.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={a.id}
                  className={`annc-sticky-note ${cls}`}
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <div className={`annc-pin ${pinCls}`} />
                  <h3 className={`annc-note-title ${caveat.className}`}>{a.title}</h3>
                  <p className="annc-note-body">{a.body}</p>
                  <div className="annc-note-footer">
                    <span className="annc-note-date">{date}</span>
                    <span className="annc-note-badge">📢 Admin</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
