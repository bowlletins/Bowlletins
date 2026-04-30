import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Role} from '@prisma/client';

export default async function AdminPage() {
  const session = await auth();

  adminProtectedPage(
    session as { user: { email: string; id: string; name: string; role?: string } } | null,
  );

  const [allUsers, allFlyers] = await Promise.all([
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
        <Col md={4}>
          <StatCard label="Total Users" value={allUsers.length} color="primary" />
        </Col>
        <Col md={4}>
          <StatCard label="Total Flyers" value={allFlyers.length} color="success" />
        </Col>
        <Col md={4}>
          <StatCard label="Total Saves" value={totalSaves} color="warning" />
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
              <th>Actions</th>
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
                <td>
                  <a
                    href={``}
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
                  <a
                    href={`/flyer/${f.id}/edit`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </a>
                  <a
                    href={``}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </a>
                  
                </td>
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
