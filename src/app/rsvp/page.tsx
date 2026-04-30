import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Container, Table, Badge } from 'react-bootstrap';
import { notFound, redirect } from 'next/navigation';

export default async function RsvpPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const flyerId = parseInt(params.id);

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
    <Container fluid className="p-5">
      <h1 className="fw-bold mb-1">RSVP List</h1>
      <p className="text-muted mb-1">
        <span className="fw-semibold">{flyer.title}</span>
      </p>
      <p className="text-muted mb-5">
        {flyer.date} · {flyer.location}
      </p>

      {/* Stats */}
      <div className="mb-5">
        <div className="p-4 shadow-sm rounded border-start border-primary border-4 bg-white d-inline-block">
          <h2 className="fw-bold mb-0">{rsvpUsers.length}</h2>
          <p className="text-muted mb-0 small">Total RSVPs</p>
        </div>
      </div>

      {/* RSVP Table */}
      <section className="mb-5">
        <h4 className="fw-bold mb-3">Attendees</h4>
        {rsvpUsers.length === 0 ? (
          <p className="text-muted">No one has RSVP&apos;d to this flyer yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
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
                  <td>{u.fullName ?? '—'}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.major ? (
                      <Badge bg="secondary">{u.major}</Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <a href={`/flyers/${flyerId}`} className="btn btn-outline-secondary">
        ← Back to Flyer
      </a>
    </Container>
  );
}