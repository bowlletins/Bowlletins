import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import Link from 'next/link';
import { Badge } from 'react-bootstrap';
import { Role } from '@prisma/client';

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

  const totalSaves = allFlyers.reduce((acc: number, f: { savedBy: string[] }) => acc + f.savedBy.length, 0);

  return (
    <div className="admin-page-bg">
      <div className="admin-content-card">

        {/* Header */}
        <div className="admin-messages-header">
          <div>
            <h1 className="admin-page-title">Admin Dashboard</h1>
            <p className="admin-page-subtitle">Manage users, flyers, and listings</p>
          </div>
          <Link href="/admin/messages" className="admin-btn admin-btn-view">
            📢 Announcements
          </Link>
        </div>

        {/* Stats */}
        <div className="admin-stats-row">
          <div className="admin-stat-card users">
            <div className="admin-stat-number">{allUsers.length}</div>
            <p className="admin-stat-label">Total Users</p>
          </div>
          <div className="admin-stat-card flyers">
            <div className="admin-stat-number">{allFlyers.length}</div>
            <p className="admin-stat-label">Total Flyers</p>
          </div>
          <div className="admin-stat-card saves">
            <div className="admin-stat-number">{totalSaves}</div>
            <p className="admin-stat-label">Total Saves</p>
          </div>
        </div>

        {/* Users Table */}
        <section>
          <h4 className="admin-section-title">Users</h4>
          <div className="admin-table-wrapper">
            <table className="table admin-table">
              <thead>
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
                {allUsers.map((u: { id: number; fullName: string | null; email: string; major: string | null; role: string }) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="admin-name-cell">{u.fullName ?? '—'}</td>
                    <td className="admin-email-cell">{u.email}</td>
                    <td>{u.major ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
                    <td>
                      <Badge className={u.role === Role.ADMIN ? 'badge-admin' : 'badge-user'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td>
                      <a href="" className="admin-btn admin-btn-view">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Flyers Table */}
        <section>
          <h4 className="admin-section-title">Flyers</h4>
          <div className="admin-table-wrapper">
            <table className="table admin-table">
              <thead>
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
                {allFlyers.map((f: { id: number; title: string; category: string; date: string; location: string; owner: string; savedBy: string[] }) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td className="admin-name-cell">{f.title}</td>
                    <td>
                      <Badge className="badge-category">{f.category}</Badge>
                    </td>
                    <td>{f.date}</td>
                    <td>{f.location}</td>
                    <td className="admin-email-cell">{f.owner}</td>
                    <td>
                      <span className="admin-saves-pill">{f.savedBy.length}</span>
                    </td>
                    <td>
                      <a href={`/flyer/${f.id}`} className="admin-btn admin-btn-view">View</a>
                      <a href={`/flyer/${f.id}/edit`} className="admin-btn admin-btn-edit">Edit</a>
                      <a href="" className="admin-btn admin-btn-delete">Delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
