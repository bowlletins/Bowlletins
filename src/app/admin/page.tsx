import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Role, Major, Condition, FlyerCategory } from '@prisma/client';

export default async function AdminPage() {
  const session = await auth();

  adminProtectedPage(
    session as { user: { email: string; id: string; name: string; role?: string } } | null,
  );

  const [allUsers, allFlyers, allStuff] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: 'desc' } }),
    prisma.flyer.findMany({ orderBy: { id: 'desc' } }),
    prisma.stuff.findMany({ orderBy: { id: 'desc' } }),
  ]);

  const totalSaves = allFlyers.reduce((acc, f) => acc + f.savedBy.length, 0);

  return (
    <Container fluid className="p-5">
      <h1 className="fw-bold mb-1">Admin Dashboard</h1>
      <p className="text-muted mb-5">Manage users, flyers, and listings</p>

      {/* Stats */}
      <Row className="mb-5 g-4">
        <Col md={3}>
          <StatCard label="Total Users" value={allUsers.length} color="primary" />
        </Col>
        <Col md={3}>
          <StatCard label="Total Flyers" value={allFlyers.length} color="success" />
        </Col>
        <Col md={3}>
          <StatCard label="Total Saves" value={totalSaves} color="warning" />
        </Col>
        <Col md={3}>
          <StatCard label="Stuff Listings" value={allStuff.length} color="info" />
        </Col>
      </Row>

      {/* Users Table */}
      <section className="mb-5">
        <h4 className="fw-bold mb-3">Users</h4>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Major</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName ?? '—'}</td>
                <td>{u.email}</td>
                <td>{u.major ?? '—'}</td>
                <td>
                  <Badge bg={u.role === Role.ADMIN ? 'danger' : 'secondary'}>
                    {u.role}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Flyers Table */}
      <section className="mb-5">
        <h4 className="fw-bold mb-3">Flyers</h4>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Location</th>
              <th>Owner</th>
              <th>Saves</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allFlyers.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.title}</td>
                <td>
                  <Badge bg="success">{f.category}</Badge>
                </td>
                <td>{f.date}</td>
                <td>{f.location}</td>
                <td>{f.owner}</td>
                <td>{f.savedBy.length}</td>
                <td>
                  <a
                    href={`/flyer/${f.id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Stuff Table */}
      <section>
        <h4 className="fw-bold mb-3">Stuff Listings</h4>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {allStuff.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.quantity}</td>
                <td>
                  <Badge bg={conditionColor(s.condition)}>{s.condition}</Badge>
                </td>
                <td>{s.owner}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </Container>
  );
}

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className={`p-4 shadow-sm rounded border-start border-${color} border-4 bg-white`}>
    <h2 className="fw-bold mb-0">{value}</h2>
    <p className="text-muted mb-0 small">{label}</p>
  </div>
);

function conditionColor(condition: Condition): string {
  switch (condition) {
    case 'excellent': return 'success';
    case 'good':      return 'primary';
    case 'fair':      return 'warning';
    case 'poor':      return 'danger';
    default:          return 'secondary';
  }
}