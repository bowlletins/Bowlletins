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

  const [allUsers, allFlyers, contactMessages] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: 'desc' } }),
    prisma.flyer.findMany({ orderBy: { id: 'desc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const totalSaves = allFlyers.reduce((acc: number, f: { savedBy: string[] }) => acc + f.savedBy.length, 0);
  const unreadCount = contactMessages.filter((m) => !m.isRead).length;

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
        <div className="admin-stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
          <div className="admin-stat-card" style={{ background: 'linear-gradient(135deg, #fce8e8, #f0d4d4)', borderLeft: '4px solid #c05a5a' }}>
            <div className="admin-stat-number">{unreadCount}</div>
            <p className="admin-stat-label">Unread Messages</p>
          </div>
        </div>

        {/* Contact Messages */}
        <section>
          <h4 className="admin-section-title">
            Contact Messages ({contactMessages.length})
            {unreadCount > 0 && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#c05a5a', color: '#fff', borderRadius: '999px', padding: '0.15em 0.6em', fontWeight: 600 }}>
                {unreadCount} new
              </span>
            )}
          </h4>
          <div className="admin-table-wrapper">
            {contactMessages.length === 0 ? (
              <p style={{ padding: '1rem', color: '#6b7280', fontStyle: 'italic' }}>No messages yet.</p>
            ) : (
              <table className="table admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((m) => (
                    <tr key={m.id} style={!m.isRead ? { background: '#fafff5' } : undefined}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {m.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="admin-name-cell">{m.name}</td>
                      <td className="admin-email-cell">{m.email}</td>
                      <td style={{ fontWeight: 500 }}>{m.subject}</td>
                      <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
                        {m.body}
                      </td>
                      <td>
                        <Badge className={m.isRead ? 'badge-user' : 'badge-admin'}>
                          {m.isRead ? 'Read' : 'New'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

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
