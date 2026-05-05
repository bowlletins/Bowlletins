import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Container, Badge } from 'react-bootstrap';
import { notFound, redirect } from 'next/navigation';

export default async function RsvpPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const { id } = await params;
  const flyerId = parseInt(id);

  if (isNaN(flyerId)) notFound();

  const flyer = await prisma.flyer.findUnique({
    where: { id: flyerId },
  });

  if (!flyer) notFound();

  if (flyer.owner !== session.user.email) {
    redirect(`/flyers/${flyerId}`);
  }

  const rsvpUsers = await prisma.user.findMany({
    where: { email: { in: flyer.rsvpBy } },
    select: {
      id: true,
      fullName: true,
      email: true,
      major: true,
    },
    orderBy: { id: 'desc' },
  });

  return (
    <>
      <div className="rsvp-page-bg">
        <div className="rsvp-content-card">

          {/* Back link */}
          <a href={`/homeDashboard`} className="rsvp-back-link">
            ← Back
          </a>

          {/* Header */}
          <h1 className="rsvp-page-title">RSVP List</h1>
          <p className="rsvp-meta mb-1">
            <span className="rsvp-flyer-name">{flyer.title}</span>
          </p>
          <p className="rsvp-meta">
            {flyer.date} · {flyer.location}
          </p>

          {/* Stat */}
          <div className="rsvp-stat-card">
            <div className="rsvp-stat-number">{rsvpUsers.length}</div>
            <p className="rsvp-stat-label">Total RSVPs</p>
          </div>

          {/* Table */}
          <section>
            <h4 className="rsvp-section-title">Attendees</h4>

            {rsvpUsers.length === 0 ? (
              <div className="rsvp-empty-state">
                <div className="rsvp-empty-icon">📭</div>
                <p className="mb-0">No one has RSVP&apos;d to this flyer yet.</p>
              </div>
            ) : (
              <div className="rsvp-table-wrapper">
                <table className="table rsvp-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Major</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpUsers.map((u, index) => (
                      <tr key={u.id}>
                        <td>{index + 1}</td>
                        <td className="rsvp-name-cell">{u.fullName ?? '—'}</td>
                        <td className="rsvp-email-cell">{u.email}</td>
                        <td>
                          {u.major ? (
                            <Badge className="rsvp-major-badge">{u.major}</Badge>
                          ) : (
                            <span style={{ color: '#d1d5db' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <a href={`/flyers/${flyerId}`} className="rsvp-view-btn">
            View Flyer
          </a>

        </div>
      </div>
    </>
  );
}