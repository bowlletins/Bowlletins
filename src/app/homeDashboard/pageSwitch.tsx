'use client';

import { useState } from 'react';
import { Col, Image, Row, Container } from 'react-bootstrap';
import { Major } from '@prisma/client';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  major: Major;
  image: string;
  role: string;
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
  savedBy: string[];
  isPrivate: boolean;
};

type ActiveTab = 'saved' | 'myFlyers';

export default function PageSwitch({
  user,
  savedFlyers,
  myFlyers,
}: {
  user: SessionUser;
  savedFlyers: Flyer[];
  myFlyers: Flyer[];
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('saved');

  return (
    <Container fluid className="dashboard-layout-bg">
      <Row>
        <Col md={3} lg={2} className="sidebar-column">
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

              <a
                href="#"
                className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('saved');
                }}
              >
                Saved Flyers
              </a>

              <a
                href="#"
                className={`nav-link ${activeTab === 'myFlyers' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('myFlyers');
                }}
              >
                My Flyers
              </a>

              <a href="/create-flyer" className="nav-link">Create a Flyer</a>

              {user.role === 'ADMIN' && (
                <a href="/admin" className="nav-link">Admin Dashboard</a>
              )}

              <a href="/profile" className="nav-link">Settings</a>
            </div>
          </div>
        </Col>

        <Col md={9} lg={10} className="main-column">
          <div className="p-5">
            <h1 className="welcome-heading mb-5">Welcome back, {user.name || 'User'}</h1>

            <section>
              <h3 className="section-subtitle mb-4">
                {activeTab === 'saved' ? 'Saved Flyers' : 'My Flyers'}
              </h3>

              <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                {activeTab === 'saved' ? (
                  savedFlyers.length === 0 ? (
                    <p className="text-muted">No saved flyers yet.</p>
                  ) : (
                    savedFlyers.map((flyer) => (
                      <FlyerCard key={flyer.id} flyer={flyer} />
                    ))
                  )
                ) : myFlyers.length === 0 ? (
                  <p className="text-muted">You haven&apos;t created any flyers yet.</p>
                ) : (
                  myFlyers.map((flyer) => (
                    <FlyerCard key={flyer.id} flyer={flyer} showPrivateBadge />
                  ))
                )}
              </div>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const FlyerCard = ({ flyer, showPrivateBadge }: { flyer: Flyer; showPrivateBadge?: boolean }) => (
  <div className="post-card d-flex align-items-center p-3 mb-3 shadow-sm">
    <div className="post-icon me-3">📔</div>
    <div className="flex-grow-1">
      <h6 className="fw-bold mb-0">
        {flyer.title}
        {showPrivateBadge && flyer.isPrivate && (
          <span className="flyer-private-badge">🔒 Private</span>
        )}
      </h6>
      <small className="text-muted">{flyer.description}</small>
    </div>
    <a href={`/flyers/${flyer.id}`} className="btn btn-sm btn-outline-success ms-3">
      View Post
    </a>
  </div>
);