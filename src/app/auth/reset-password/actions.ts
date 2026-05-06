'use server';

import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

function isStrongPassword(password: string) {
  return (
    password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /[0-9]/.test(password)
    && /[^A-Za-z0-9]/.test(password)
  );
}

export async function resetPassword(formData: FormData) {
  const token = String(formData.get('token') || '');
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!token) {
    return { error: 'Reset token is missing.' };
  }

  if (!password || !confirmPassword) {
    return { error: 'Password and confirmation are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  if (!isStrongPassword(password)) {
    return {
      error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
    };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return { error: 'This reset link is invalid or has already been used.' };
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return { error: 'This reset link has expired. Please request a new one.' };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { token },
  });

  return { success: 'Your password has been reset. You can now sign in.' };
}