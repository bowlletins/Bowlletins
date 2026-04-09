import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BriefcaseFill, CalendarEventFill, BookFill, Search } from 'react-bootstrap-icons';

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-board">
        <Container fluid className="px-0">
          <Row className="g-0 align-items-start hero-content">
            <Col lg={6} className="hero-left">
              <div className="hero-text-block">
                <h1 className="hero-title">
                  Stay Connected with
                  <br />
                  Bow-lletins!
                </h1>
                <p className="hero-subtitle">
                  Your all-in-one campus bulletin board
                  <br />
                  for UH Mānoa students.
                </p>
              </div>
            </Col>

            <Col lg={6} className="hero-right">
              <div className="signup-note">
                <div className="note-corner-rainbow" />
                <div className="pin pin-green" />
                <h2 className="signup-title">Log In</h2>

                <Form>
                  <div className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      className="signup-input"
                    />
                  </div>

                  <div className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      className="signup-input"
                    />
                  </div>

                  <Button className="signup-btn w-100" type="submit">
                    Log In
                  </Button>
                </Form>

                <p className="signup-login-text mt-3 mb-0">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="signup-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            </Col>
          </Row>

          <div className="sticky-note note-job">
            <div className="pin pin-red" />
            <div className="note-icon">
              <BriefcaseFill />
            </div>
            <h4>Job Opportunities</h4>
            <p>Find the latest job and work study opportunities on campus.</p>
          </div>

          <div className="sticky-note note-events">
            <div className="pin pin-yellow" />
            <div className="note-icon">
              <CalendarEventFill />
            </div>
            <h4>Campus Events</h4>
            <p>Stay updated with club events, deadlines, and activities.</p>
          </div>

          <div className="sticky-note note-study">
            <div className="pin pin-blue" />
            <div className="note-icon">
              <BookFill />
            </div>
            <h4>Study Groups</h4>
            <p>Join or create study groups and connect with your peers.</p>
          </div>

          <div className="sticky-note note-lab">
            <div className="pin pin-green" />
            <div className="note-icon">
              <BriefcaseFill />
            </div>
            <h4>Lab Opportunities</h4>
            <p>Discover research and lab opportunities across campus.</p>
          </div>

          <div className="board-search">
            <input type="text" placeholder="Search" />
            <button type="button" aria-label="Search">
              <Search />
            </button>
          </div>
        </Container>
      </section>

      <section className="category-strip">
        <Container>
          <Row className="justify-content-center text-center gy-4">
            <Col xs={6} md={3}>
              <div className="category-item">
                <span className="category-pin pin-green" />
                <div>
                  <h5>Job</h5>
                  <p>Opportunities</p>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="category-item">
                <span className="category-pin pin-yellow" />
                <div>
                  <h5>Internship</h5>
                  <p>Listings</p>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="category-item">
                <span className="category-pin pin-red" />
                <div>
                  <h5>Campus</h5>
                  <p>Events</p>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3}>
              <div className="category-item">
                <span className="category-pin pin-blue" />
                <div>
                  <h5>Study</h5>
                  <p>Groups</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}