'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';
import { resetPassword } from './actions';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    setError(null);

    const result = await resetPassword(formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.success) {
      setMessage(result.success);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Reset Password</h1>

      <p className="auth-subtitle">
        Create a new password for your Bow-lletins account.
      </p>

      {!token && (
        <p className="text-danger">
          Reset token is missing. Please request a new password reset link.
        </p>
      )}

      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <Form action={handleSubmit}>
        <input type="hidden" name="token" value={token} />

        <div className="mb-3">
          <Form.Control
            name="password"
            type="password"
            placeholder="New password"
            className="signup-input"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="mb-3">
          <Form.Control
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            className="signup-input"
            autoComplete="new-password"
            required
          />
        </div>

        <Form.Text className="text-muted small d-block mb-3">
          Password must be at least 8 characters and include uppercase,
          lowercase, number, and special character.
        </Form.Text>

        <Button className="signup-btn w-100" type="submit" disabled={!token}>
          Reset Password
        </Button>
      </Form>

      <p className="signup-login-text mt-3 mb-0">
        Back to{' '}
        <Link href="/" className="signup-link">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <Suspense
        fallback={
          <div className="auth-card">
            <h1 className="auth-title">Loading...</h1>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}