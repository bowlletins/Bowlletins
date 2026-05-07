'use client';

import { useState } from 'react';
import { Col, Image, Row, Container } from 'react-bootstrap';
import {
  Bookmark,
  FileEarmarkText,
  ClockHistory,
  PlusSquare,
  ShieldCheck,
  HouseDoor,
} from 'react-bootstrap-icons';
import { Major } from '@prisma/client';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  username: string;
  useFullNameDisplay: boolean;
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

type ActiveTab = 'home' | 'saved' | 'myFlyers' | 'expiredFlyers';

export default function PageSwitch({
  user,
  savedFlyers,
  myFlyers,
  expiredFlyers,
  initialTab,
}: {
  user: SessionUser;
  savedFlyers: Flyer[];
  myFlyers: Flyer[];
  expiredFlyers: Flyer[];
  initialTab?: string;
}) {
  const startingTab: ActiveTab =
    initialTab === 'myFlyers'
      ? 'myFlyers'
      : initialTab === 'expiredFlyers'
        ? 'expiredFlyers'
        : initialTab === 'saved' || initialTab === 'savedFlyers'
          ? 'saved'
          : 'home';

  const [activeTab, setActiveTab] = useState<ActiveTab>(startingTab);

  const displayName = user.useFullNameDisplay
    ? user.name || user.username || 'User'
    : user.username || user.name || 'User';

  const recentFlyers = myFlyers.length > 0 ? myFlyers.slice(0, 3) : savedFlyers.slice(0, 3);

  return (
    <Container fluid className="dashboard-layout-bg">
      <Row className="dashboard-row">
        <Col md={3} lg={2} className="sidebar-column">
          <div className="dashboard-sidebar-card">
            <div className="dashboard-profile-card">
              <Image
                src={user.image || '/default-profile.png'}
                roundedCircle
                className="profile-avatar mb-3 shadow-sm"
              />
              <h5 className="fw-bold m-0">{displayName}</h5>
              <p className="text-muted small mb-0">{user.major}</p>
            </div>

            <div className="custom-nav d-flex flex-column">
              <a
                href="#"
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('home');
                }}
              >
                <HouseDoor className="dashboard-nav-icon" />
                Home
              </a>

              <a
                href="#"
                className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('saved');
                }}
              >
                <Bookmark className="dashboard-nav-icon" />
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
                <FileEarmarkText className="dashboard-nav-icon" />
                My Flyers
              </a>

              <a
                href="#"
                className={`nav-link ${activeTab === 'expiredFlyers' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('expiredFlyers');
                }}
              >
                <ClockHistory className="dashboard-nav-icon" />
                Expired Flyers
              </a>

              <a href="/create-flyer" className="nav-link">
                <PlusSquare className="dashboard-nav-icon" />
                Create a Flyer
              </a>

              {user.role === 'ADMIN' && (
                <a href="/admin" className="nav-link">
                  <ShieldCheck className="dashboard-nav-icon" />
                  Admin Dashboard
                </a>
              )}

              {/*<a href="/profile" className="nav-link">Settings</a>*/}
            </div>
          </div>
        </Col>

        <Col md={9} lg={10} className="main-column">
          <div className="dashboard-main-content">
            <h1 className="welcome-heading mb-2">Welcome back, {displayName}</h1>
            <p className="dashboard-subheading">
              Here&apos;s what&apos;s happening with your flyers.
            </p>

            {activeTab === 'home' ? (
              <>
                <div className="dashboard-stats-grid">
                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <Bookmark />
                    </div>
                    <div>
                      <p className="dashboard-stat-label">Saved Flyers</p>
                      <h3>{savedFlyers.length}</h3>
                      <small>Flyers you&apos;ve saved</small>
                    </div>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <FileEarmarkText />
                    </div>
                    <div>
                      <p className="dashboard-stat-label">My Flyers</p>
                      <h3>{myFlyers.length}</h3>
                      <small>Flyers you&apos;ve created</small>
                    </div>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <ClockHistory />
                    </div>
                    <div>
                      <p className="dashboard-stat-label">Expired Flyers</p>
                      <h3>{expiredFlyers.length}</h3>
                      <small>Flyers no longer active</small>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="section-subtitle mb-3">Recent Flyers</h3>

                  <div className="dashboard-flyer-scroll">
                    {recentFlyers.length === 0 ? (
                      <p className="text-muted">No recent flyer activity yet.</p>
                    ) : (
                      recentFlyers.map((flyer) => (
                        <FlyerCard
                          key={flyer.id}
                          flyer={flyer}
                          showPrivateBadge={flyer.owner === user.email}
                        />
                      ))
                    )}
                  </div>
                </section>
              </>
            ) : (
              <section>
                <h3 className="section-subtitle mb-3">
                  {activeTab === 'saved'
                    ? 'Saved Flyers'
                    : activeTab === 'myFlyers'
                      ? 'My Flyers'
                      : 'Expired Flyers'}
                </h3>

                <div className="dashboard-flyer-scroll">
                  {activeTab === 'saved' ? (
                    savedFlyers.length === 0 ? (
                      <p className="text-muted">No saved flyers yet.</p>
                    ) : (
                      savedFlyers.map((flyer) => (
                        <FlyerCard key={flyer.id} flyer={flyer} />
                      ))
                    )
                  ) : activeTab === 'myFlyers' ? (
                    myFlyers.length === 0 ? (
                      <p className="text-muted">You haven&apos;t created any flyers yet.</p>
                    ) : (
                      myFlyers.map((flyer) => (
                        <FlyerCard key={flyer.id} flyer={flyer} showPrivateBadge />
                      ))
                    )
                  ) : expiredFlyers.length === 0 ? (
                    <p className="text-muted">You do not have any expired flyers yet.</p>
                  ) : (
                    expiredFlyers.map((flyer) => (
                      <FlyerCard key={flyer.id} flyer={flyer} showPrivateBadge showExpiredBadge />
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Jobs':
      return '💼';
    case 'Internships':
      return '🧑‍💻';
    case 'Volunteer':
      return '🤝';
    case 'Events':
      return '🎉';
    case 'Academics':
      return '📚';
    case 'Social':
      return '☕';
    case 'Clubs_Organizations':
      return '🏫';
    case 'Other':
    default:
      return '📌';
  }
};

const FlyerCard = ({
  flyer,
  showPrivateBadge,
  showExpiredBadge,
}: {
  flyer: Flyer;
  showPrivateBadge?: boolean;
  showExpiredBadge?: boolean;
}) => (
  <div className="dashboard-flyer-card">
    <div className="dashboard-flyer-icon">
      {getCategoryIcon(flyer.category)}
    </div>

    <div className="dashboard-flyer-info">
      <h6>
        {flyer.title}
        {showPrivateBadge && flyer.isPrivate && (
          <span className="flyer-private-badge">🔒 Private</span>
        )}
        {showExpiredBadge && (
          <span className="flyer-private-badge">Expired</span>
        )}
      </h6>
      <small>{flyer.description}</small>
    </div>

    <div className="dashboard-flyer-actions">
      {showPrivateBadge && (
        <a href={`/flyers/${flyer.id}/rsvp`} className="btn btn-sm btn-outline-success">
          View Interest
        </a>
      )}

      {showPrivateBadge && (
        <a href={`/flyers/${flyer.id}/edit`} className="btn btn-sm btn-success">
          Edit
        </a>
      )}

      <a href={`/flyers/${flyer.id}`} className="btn btn-sm btn-outline-success">
        View Post
      </a>
    </div>
  </div>
);