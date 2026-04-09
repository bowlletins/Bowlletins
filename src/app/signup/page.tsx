'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <main className="signup-page">
      <section className="signup-page-board">
        <Container fluid className="px-0">
          <Row className="g-0 justify-content-center align-items-center signup-page-content">
            <Col lg={6} md={8}>
              <div className="signup-page-note mx-auto">
                <div className="note-corner-rainbow" />
                <div className="pin pin-green" />

                <h1 className="signup-page-title">Sign Up</h1>
                <p className="signup-page-subtitle">
                  Create your Bow-lletins account to stay updated with campus
                  opportunities, events, and student connections.
                </p>

                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Form.Label className="signup-page-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="signup-page-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <Form.Label className="signup-page-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      className="signup-page-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="signup-page-btn w-100">
                    Sign Up
                  </Button>
                </Form>

                <p className="signup-page-login-text mt-3 mb-0">
                  Already have an account?{' '}
                  <Link href="/" className="signup-page-link">
                    Log In
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}