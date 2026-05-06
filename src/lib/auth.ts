import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';
import { Major } from '@prisma/client';

// Extend the Session type to include custom user fields.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      usernameUpdatedAt?: Date | null;
      useFullNameDisplay?: boolean;
      major?: Major;
      role?: string;
      image?: string | null;
    } & DefaultSession['user'];
  }

  // Define what the user object looks like when returned from authorize.
  interface User {
    fullName?: string;
    username?: string;
    usernameUpdatedAt?: Date | null;
    useFullNameDisplay?: boolean;
    major?: Major;
    role?: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username ?? user.fullName ?? user.email,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/',
    signOut: '/auth/signout',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;

        const dbUser = await prisma.user.findUnique({
          where: { id: parseInt(token.id as string, 10) },
          select: {
            fullName: true,
            username: true,
            usernameUpdatedAt: true,
            useFullNameDisplay: true,
            major: true,
            image: true,
          },
        });

        session.user.name = dbUser?.useFullNameDisplay
          ? dbUser.fullName ?? dbUser.username ?? session.user.name
          : dbUser?.username ?? dbUser?.fullName ?? session.user.name;

        session.user.username = dbUser?.username ?? undefined;
        session.user.usernameUpdatedAt = dbUser?.usernameUpdatedAt ?? null;
        session.user.useFullNameDisplay = dbUser?.useFullNameDisplay ?? false;
        session.user.major = dbUser?.major ?? undefined;
        session.user.image = dbUser?.image ?? null;
      }

      return session;
    },
  },
});