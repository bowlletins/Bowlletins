import { Major } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import { Container, Row, Col, Image } from 'react-bootstrap';
import React from 'react';
import { prisma } from '@/lib/prisma';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  major: Major;
  image: string;
};

type Flyer = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  contactInfo: string;
  owner: string;
};

export default async function BoardPage() {
  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const dbUser = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      fullName: true,
      major: true,
      image: true,
    },
  });

  const user: SessionUser = {
    email: session!.user.email!,
    id: session!.user.id,
    name: dbUser?.fullName || 'User',
    major: dbUser?.major || 'Other',
    image: dbUser?.image || '',
  };

  const savedFlyers = await prisma.flyer.findMany({
    where: { owner: user.email },
  });

  return (
    <Container fluid className="dashboard-layout-bg">
      <Row>
        <Col md={3} lg={2} className="sidebar-column">
          <SidebarContent user={user} />
        </Col>
        <Col md={9} lg={10} className="main-column">
          <MainFeed user={user} savedFlyers={savedFlyers} />  {/* pass savedFlyers */}
        </Col>
      </Row>
    </Container>
  );
}

const SidebarContent: React.FC<{ user: SessionUser }> = ({ user }) => {
  return (
    <div className="py-4 px-3 d-flex flex-column h-100">
      <div className="text-center mb-5">
        <Image
          src={user.image || '/default-profile.png'}
          rounded
          className="profile-avatar mb-3 shadow-sm"
        />
        <h5 className="fw-bold m-0">{user.name ?? 'User'}</h5>
        <p className="text-muted small">{user.major}</p>
      </div>

      <div className="flex-column nav-pills custom-nav d-flex flex-column">
        <a href="#" className="nav-link">Home</a>
        <a href="#" className="nav-link active">Saved Posts</a>
        <a href="#" className="nav-link">Recently Viewed</a>
        <a href="#" className="nav-link">Messages</a>
        <a href="/create-flyer" className="nav-link">Create a Flyer</a>
        <a href="/profile" className="nav-link">Settings</a>
      </div>
    </div>
  );
};

const MainFeed: React.FC<{ user: SessionUser; savedFlyers: Flyer[] }> = ({ user, savedFlyers }) => {
  return (
    <div className="p-5">
      <h1 className="welcome-heading mb-5">Welcome back, {user.name || 'User'}</h1>

      <section>
        <h3 className="section-subtitle mb-4">Saved Posts</h3>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          {savedFlyers.length === 0 ? (
            <p className="text-muted">No saved posts yet.</p>
          ) : (
            savedFlyers.map((flyer) => (
              <div key={flyer.id} className="post-card d-flex align-items-center p-3 mb-3 shadow-sm">
                <div className="post-icon me-3">📔</div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{flyer.title}</h6>
                  <small className="text-muted">{flyer.description}</small>
                </div>
                <a
                  href={`/flyer/${flyer.id}`}
                  className="btn btn-sm btn-outline-success ms-3"
                >
                  View Post
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};