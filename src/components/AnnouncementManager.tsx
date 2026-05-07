'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface Announcement {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  authorEmail: string;
  targetAudience: string;
}

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementManager({ announcements }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, targetAudience }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post announcement');
      }

      setTitle('');
      setBody('');
      setTargetAudience('ALL');
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch {
      alert('Failed to delete announcement.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Compose form — styled as a sticky note */}
      <div className="announcement-compose-note">
        <div className="flyer-pin pin-green-custom" />
        <div className="flyer-note-corner-rainbow" />

        <h2 className="announcement-compose-title">📢 New Announcement</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="announcement-label">Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Site maintenance this Friday…"
              className="announcement-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="announcement-label">Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your announcement here…"
              className="announcement-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="announcement-label">Audience</Form.Label>
            <Form.Select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="announcement-input"
            >
              <option value="ALL">All Users</option>
            </Form.Select>
          </Form.Group>

          {error && <p className="auth-error mb-3">{error}</p>}
          {success && (
            <p className="announcement-success mb-3">✓ Announcement posted successfully!</p>
          )}

          <Button type="submit" className="announcement-post-btn" disabled={loading}>
            {loading ? 'Posting…' : 'Post Announcement'}
          </Button>
        </Form>
      </div>

      {/* Past announcements list */}
      <div className="mt-5">
        <h3 className="admin-section-title">Past Announcements ({announcements.length})</h3>

        {announcements.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
            No announcements posted yet.
          </p>
        ) : (
          <div className="announcement-admin-list">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-admin-card">
                <div className="announcement-admin-card-header">
                  <div>
                    <span className="announcement-admin-card-title">{a.title}</span>
                    <span className="announcement-admin-card-audience">
                      {a.targetAudience === 'ALL' ? '📢 All Users' : a.targetAudience}
                    </span>
                  </div>
                  <button
                    className="admin-btn admin-btn-delete"
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                    style={{ cursor: deletingId === a.id ? 'not-allowed' : 'pointer' }}
                  >
                    {deletingId === a.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
                <p className="announcement-admin-card-body">{a.body}</p>
                <p className="announcement-admin-card-meta">
                  Posted{' '}
                  {new Date(a.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  by {a.authorEmail}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
