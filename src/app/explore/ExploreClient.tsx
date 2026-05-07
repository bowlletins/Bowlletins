'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import {
  BookmarkFill,
  CalendarEvent,
  EyeFill,
  GeoAltFill,
  HeartFill,
  LockFill,
  TagFill,
} from 'react-bootstrap-icons';

type Flyer = {
  id: number;
  title: string;
  category: string | null;
  description: string;
  date: string;
  location: string;
  contactInfo: string;
  owner: string;
  savedBy: string[];
  views?: number;
  likes?: number;
  saves?: number;
  image?: string;
};

type ExploreClientProps = {
  flyers: Flyer[];
};

export default function ExploreClient({ flyers }: ExploreClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'liked'>('all');
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('All Categories');
  const [datePosted, setDatePosted] = useState('Anytime');
  const [sortBy, setSortBy] = useState('Most Recent');

  const [draftCategory, setDraftCategory] = useState('All Categories');
  const [draftDatePosted, setDraftDatePosted] = useState('Anytime');
  const [draftSortBy, setDraftSortBy] = useState('Most Recent');

  const [currentPage, setCurrentPage] = useState(1);
  const [flyersPerPage, setFlyersPerPage] = useState(8);

  useEffect(() => {
    const updateFlyersPerPage = () => {
      setFlyersPerPage(window.innerWidth <= 768 ? 4 : 8);
    };

    updateFlyersPerPage();
    window.addEventListener('resize', updateFlyersPerPage);

    return () => window.removeEventListener('resize', updateFlyersPerPage);
  }, []);

  const filteredFlyers = useMemo(() => {
    let results = flyers.filter((flyer) => {
      const flyerCategory = flyer.category ?? 'Other';

      const matchesSearch =
        flyer.title.toLowerCase().includes(search.toLowerCase()) ||
        flyerCategory.toLowerCase().includes(search.toLowerCase()) ||
        flyer.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All Categories' || flyerCategory === category;

      return matchesSearch && matchesCategory;
    });

    if (activeTab === 'recent' || sortBy === 'Most Recent') {
      results = [...results].sort((a, b) => b.id - a.id);
    }

    if (activeTab === 'liked' || sortBy === 'Most Liked') {
      results = [...results].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }

    if (sortBy === 'Most Viewed') {
      results = [...results].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    return results;
  }, [flyers, search, category, sortBy, activeTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFlyers.length / flyersPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * flyersPerPage;
  const endIndex = startIndex + flyersPerPage;
  const currentFlyers = filteredFlyers.slice(startIndex, endIndex);

  const nextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const applyFilters = () => {
    setCategory(draftCategory);
    setDatePosted(draftDatePosted);
    setSortBy(draftSortBy);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setDatePosted('Anytime');
    setSortBy('Most Recent');

    setDraftCategory('All Categories');
    setDraftDatePosted('Anytime');
    setDraftSortBy('Most Recent');

    setActiveTab('all');
    setCurrentPage(1);
  };

  return (
    <main className="explore-page">
      <section className="explore-hero">
        <Container>
          <h1>Browse Bulletins</h1>
          <p className="hero-subtitle">Discover what&apos;s happening on campus and beyond.</p>
        </Container>
      </section>

      <Container fluid className="explore-content px-4 py-4">
        <Row className="g-4">
          <Col lg={9}>
            <div className="d-flex justify-content-end mb-2">
              <button type="button" className="clear-link" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <Card className="filter-panel">
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Jobs</option>
                    <option>Internships</option>
                    <option>Volunteer</option>
                    <option>Events</option>
                    <option>Academics</option>
                    <option>Social</option>
                    <option>Clubs_Organizations</option>
                    <option>Other</option>
                  </Form.Select>
                </Col>

                <Col md={4}>
                  <Form.Label>Date Posted</Form.Label>
                  <Form.Select
                    value={draftDatePosted}
                    onChange={(e) => setDraftDatePosted(e.target.value)}
                  >
                    <option>Anytime</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    value={draftSortBy}
                    onChange={(e) => setDraftSortBy(e.target.value)}
                  >
                    <option>Most Recent</option>
                    <option>Most Liked</option>
                    <option>Most Viewed</option>
                  </Form.Select>
                </Col>

                <Col md={1}>
                  <Button className="apply-filter-btn" onClick={applyFilters}>
                    Apply
                  </Button>
                </Col>
              </Row>
            </Card>

            <div className="explore-tabs">
              <button
                type="button"
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
              >
                All Flyers
              </button>

              <button
                type="button"
                className={activeTab === 'recent' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('recent');
                  setCurrentPage(1);
                }}
              >
                <CalendarEvent /> Most Recent
              </button>

              <button
                type="button"
                className={activeTab === 'liked' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('liked');
                  setCurrentPage(1);
                }}
              >
                <HeartFill /> Most Liked
              </button>
            </div>

            {currentFlyers.length === 0 ? (
              <div className="explore-empty-state">
                <div className="explore-empty-pin" />
                <h3>No flyers found</h3>
                <p>
                  There are no flyers matching your current filters. Try clearing
                  your filters or check back later for new campus opportunities.
                </p>
                <Button className="apply-filter-btn" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <Row className="g-4">
                {currentFlyers.map((flyer) => (
                  <Col md={6} xl={3} key={flyer.id}>
                    <Link href={`/flyers/${flyer.id}`} className="flyer-link">
                      <Card className="flyer-card">
                        <div className="flyer-pin" />

                        <Card.Body>
                          <Badge className="flyer-category">
                            <TagFill className="me-1" />
                            {flyer.category ?? 'Other'}
                          </Badge>

                          <h3>{flyer.title}</h3>
                          <p>{flyer.description}</p>

                          <div className="flyer-detail">
                            <CalendarEvent />
                            <span>{flyer.date}</span>
                          </div>

                          <div className="flyer-detail">
                            <GeoAltFill />
                            <span>{flyer.location}</span>
                          </div>
                        </Card.Body>

                        <div className="flyer-stats">
                          <span><EyeFill /> {flyer.views ?? 0}</span>
                          <span><HeartFill /> {flyer.likes ?? 0}</span>
                          <span>
                            <BookmarkFill /> {flyer.saves ?? flyer.savedBy.length}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}

            {totalPages > 1 && (
              <div className="w-100 d-flex justify-content-center">
                <div className="explore-pagination">
                  <Button
                    className="page-nav-btn"
                    onClick={prevPage}
                    disabled={safeCurrentPage === 1}
                  >
                    ‹
                  </Button>

                  <Button className="active">
                    {safeCurrentPage}
                  </Button>

                  {safeCurrentPage < totalPages && (
                    <Button className="ellipsis">...</Button>
                  )}

                  <Button
                    className="page-nav-btn"
                    onClick={nextPage}
                    disabled={safeCurrentPage === totalPages}
                  >
                    ›
                  </Button>
                </div>
              </div>
            )}
          </Col>

          <Col lg={3}>
            <aside className="explore-sidebar">
              <Card className="sidebar-card light-card campus-board-card">
                <Card.Body>
                  <h4 className="campus-board-title">Why Bow-lletins?</h4>
                  <p className="campus-board-subtitle">
                    A cleaner way to find what is usually lost on crowded campus boards.
                  </p>

                  <Carousel indicators controls={false} interval={3500}>
                    <Carousel.Item>
                      <div className="campus-slide">
                        <div className="campus-slide-image board-one" />
                        <h5>Crowded Boards</h5>
                        <p>Campus flyers can get buried, covered, or missed completely.</p>
                      </div>
                    </Carousel.Item>

                    <Carousel.Item>
                      <div className="campus-slide">
                        <div className="campus-slide-image board-two" />
                        <h5>Hard to Search</h5>
                        <p>Students should not have to walk around campus to find opportunities.</p>
                      </div>
                    </Carousel.Item>

                    <Carousel.Item>
                      <div className="campus-slide">
                        <div className="campus-slide-image board-three" />
                        <h5>All in One Place</h5>
                        <p>Bow-lletins makes flyers easier to browse, filter, and discover.</p>
                      </div>
                    </Carousel.Item>
                  </Carousel>
                </Card.Body>
              </Card>

              <Card className="signup-unlock-card">
                <Card.Body>
                  <LockFill className="lock-icon" />
                  <h4>Sign up to unlock full features!</h4>
                  <p>
                    Saved flyers, RSVPs, comments, and reactions are only available
                    to registered users.
                  </p>
                  <Link href="/auth/signup">
                    <Button>Sign Up Now</Button>
                  </Link>
                </Card.Body>
              </Card>
            </aside>
          </Col>
        </Row>
      </Container>
    </main>
  );
}