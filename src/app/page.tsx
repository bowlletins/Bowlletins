'use client';

import { Caveat } from "next/font/google";
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BriefcaseFill, CalendarEventFill, BookFill } from 'react-bootstrap-icons';
import { signIn } from 'next-auth/react';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    await signIn('credentials', {
      callbackUrl: '/homeDashboard',
      email,
      password,
    });
  };

  return (
    <main className="landing-page">
      <section className="hero-board">
        <Container fluid className="landing-shell">
          <div className="landing-top">
            <div className="hero-paper">
               <div className="hero-paper-pin"></div> 
              <div className="note-corner-rainbow" />

              <div className="hero-paper-holes" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>

              <div className="hero-paper-lines" aria-hidden="true" />

              <div className="hero-paper-content">
                <h1 className="hero-title">
                  Your Campus.
                  <br />
                  Your Community.
                  <br />
                  All in One Place.
                </h1>

                <div className="hero-accent-line" />

                <p className="hero-subtitle">
                  Bow-lletins is your all-in-one bulletin board for jobs, events,
                  groups, and opportunities across UH Mānoa.
                </p>  


                <Button className="hero-cta-btn" href="Explore">
                  Explore What&apos;s Happening
                </Button>

                
<div className="hero-handwritten">
  <p><span className="highlight-line">&quot;check daily 👀&quot;</span></p>
  <p><span className="highlight-line">&quot;new stuff every week&quot;</span></p>
  <p><span className="highlight-line">&quot;don’t miss deadlines!!&quot;</span></p>
</div>

<div className="hero-actions">
  <span>👍 Like</span>
  <span>📌 Save</span>
  <span>📅 RSVP</span>
</div>

              </div>
            </div>

            <div className="login-paper">
              <div className="hero-paper-pin pin-yellow" />
              <div className="note-corner-rainbow" />

              <h2 className="login-paper-title">Join the Board</h2>

              <Form method="Explore" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="signup-input"
                  />
                </div>

                <div className="mb-3">
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="signup-input"
                  />
                </div>

                <div className="login-paper-row">
                  <Form.Check
                    type="checkbox"
                    id="remember-me"
                    label="Remember me"
                    className="login-check"
                  />
                  <span className="login-forgot">Forgot password?</span>
                </div>

                <Button className="signup-btn w-100" type="submit">
                  Sign In
                </Button>
              </Form>

              <p className="signup-login-text mt-3 mb-0">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="signup-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className="landing-mini-notes">
            <div className={`mini-note mini-note-yellow ${caveat.className}`}>
              <div className="pin pin-blue" />
        
          <p>
          <br> 
         </br> Missed that club meeting<br />
                 again…
            </p>
            </div>

            <div className={`mini-note mini-note-green ${caveat.className}`}>
              <div className="pin pin-red" />
              <p>
                Well, don&apos;t miss out on another opportunity!
                <br />
                Discover.
                <br />
                  Connect.
                <br />
                Make an impact.
              </p>
            </div>

<           div className="mini-image">
                   <img src="/board_pin.png" alt="Bow-lletins sketch" />
                    <div className="mini-image-pin" />
                      </div>

            <div className="side-pin">
                 <img src="/warrior_pin.png" alt="pin" />
                    </div>

                <div className="right-pin">
            <img src="/hawaii_pin.png" alt="pin" />
                  </div>
          </div>

          <Row className="landing-feature-cards g-4">
            <Col md={6} xl={3}>
              <div className="feature-card">
                <div className="pin pin-green" />
                <div className="feature-icon feature-icon-green">
                  <BriefcaseFill />
                </div>
                <h3>Job Opportunities</h3>
                <p>Find jobs, clubs, and events<br />
                        all in one place.
</p>
                <a href="Explore" className="feature-link feature-link-green">
                  View Jobs
                </a>
              </div>
            </Col>

            <Col md={6} xl={3}>
              <div className="feature-card">
                <div className="pin pin-yellow" />
                <div className="feature-icon feature-icon-yellow">
                  <CalendarEventFill />
                </div>
                <h3>Campus Events</h3>
                <p>Discover events, deadlines, and activities happening around campus.</p>
                <a href="Explore" className="feature-link feature-link-yellow">
                  See Events
                </a>
              </div>
            </Col>

            <Col md={6} xl={3}>
              <div className="feature-card">
                <div className="pin pin-red" />
                <div className="feature-icon feature-icon-red">
                  <BookFill />
                </div>
                <h3>Study Groups</h3>
                <p>Join or create study groups and connect with your peers.</p>
                <a href="Explore" className="feature-link feature-link-red">
                  Explore Groups
                </a>
              </div>
            </Col>

            <Col md={6} xl={3}>
              <div className="feature-card">
                <div className="pin pin-blue" />
                <div className="feature-icon feature-icon-blue">
                  <BookFill />
                </div>
                <h3>Internships</h3>
                <p>Browse internship listings and kickstart your career.</p>
                <a href="Explore" className="feature-link feature-link-blue">
                  Find Internships
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}