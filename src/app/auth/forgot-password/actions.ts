'use server';

import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();

  if (!email) {
    return { error: 'Email is required.' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Do not reveal if an email exists or not.
  if (!user) {
    return {
      success: 'If an account exists with that email, a reset link has been sent.',
    };
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESET_EMAIL_FROM || 'Bow-lletins <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your Bow-lletins password',
    html: `
      <p>Hello,</p>
      <p>You requested a password reset for your Bow-lletins account.</p>
      <p>
        <a href="${resetLink}">Click here to reset your password</a>
      </p>
      <p>This link expires in 30 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });

  return {
    success: 'If an account exists with that email, a reset link has been sent.',
  };
}