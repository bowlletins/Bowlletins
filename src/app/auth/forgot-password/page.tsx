'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';
import { requestPasswordReset } from './actions';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    setError(null);

    const result = await requestPasswordReset(formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.success) {
      setMessage(result.success);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>

        <p className="auth-subtitle">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <Form action={handleSubmit}>
          <div className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email address"
              className="signup-input"
              autoComplete="off"
              required
            />
          </div>

          <Button className="signup-btn w-100" type="submit">
            Send Reset Link
          </Button>
        </Form>

        <p className="signup-login-text mt-3 mb-0">
          Remember your password?{' '}
          <Link href="/" className="signup-link">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}