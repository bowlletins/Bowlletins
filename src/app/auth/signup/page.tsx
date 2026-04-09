'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      name,
      email,
      password,
    });
  };

  return (
    <main className="signup-split-page">
      <section className="signup-split-left">
        <div className="signup-split-content">
          <p className="signup-eyebrow">Start your journey</p>
          <h1 className="signup-split-title">Sign Up to Bow-lletins</h1>

          <Form onSubmit={handleSubmit} className="signup-split-form">
            <div className="mb-4">
              <Form.Control
                type="text"
                placeholder="Your name"
                className="signup-split-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <Form.Control
                type="email"
                placeholder="Email address"
                className="signup-split-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                className="signup-split-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="signup-split-btn w-100">
              Sign Up
            </Button>
          </Form>

          <p className="signup-split-login-text">
            Have an account?{' '}
            <Link href="/" className="signup-split-link">
              Sign In
            </Link>
          </p>
        </div>
      </section>

      <section className="signup-split-right">
        <div className="signup-split-overlay" />
      </section>
    </main>
  );
}