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
      <style>{`
        .rsvp-page-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e8f0e8 50%, #f5f0eb 100%);
          padding: 2.5rem;
        }

        .rsvp-content-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .rsvp-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #5a7a5a;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.75rem;
          transition: color 0.2s ease;
        }

        .rsvp-back-link:hover {
          color: #3d5c3d;
        }

        .rsvp-page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e2a1e;
          margin-bottom: 0.25rem;
          letter-spacing: -0.5px;
        }

        .rsvp-flyer-name {
          color: #3d5c3d;
          font-weight: 600;
          font-size: 1rem;
        }

        .rsvp-meta {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .rsvp-stat-card {
          background: linear-gradient(135deg, #e8f0e8, #d4e6d4);
          border-left: 4px solid #5a8a5a;
          border-radius: 10px;
          padding: 1.25rem 1.75rem;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .rsvp-stat-number {
          font-size: 2.25rem;
          font-weight: 700;
          color: #2d4a2d;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .rsvp-stat-label {
          color: #5a7a5a;
          font-size: 0.8125rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .rsvp-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e2a1e;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e8f0e8;
        }

        .rsvp-table-wrapper {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e0eae0;
        }

        .rsvp-table {
          margin: 0;
          font-size: 0.9rem;
        }

        .rsvp-table thead th {
          background: #2d4a2d;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 0.85rem 1rem;
          border: none;
        }

        .rsvp-table tbody tr {
          border-color: #f0f5f0;
          transition: background 0.15s ease;
        }

        .rsvp-table tbody tr:hover {
          background-color: #f5faf5;
        }

        .rsvp-table tbody td {
          padding: 0.85rem 1rem;
          vertical-align: middle;
          color: #374151;
          border-color: #eff5ef;
        }

        .rsvp-table tbody td:first-child {
          color: #9ca3af;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .rsvp-name-cell {
          font-weight: 500;
          color: #1e2a1e;
        }

        .rsvp-email-cell {
          color: #5a7a8a;
          font-size: 0.875rem;
        }

        .rsvp-major-badge {
          background-color: #e8f0e8 !important;
          color: #3d5c3d !important;
          font-weight: 500;
          font-size: 0.775rem;
          padding: 0.3em 0.65em;
          border-radius: 6px;
        }

        .rsvp-empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .rsvp-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .rsvp-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1.5px solid #5a8a5a;
          color: #3d5c3d;
          border-radius: 8px;
          padding: 0.5rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-top: 1.5rem;
        }

        .rsvp-view-btn:hover {
          background: #3d5c3d;
          color: #ffffff;
          border-color: #3d5c3d;
        }
      `}</style>

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