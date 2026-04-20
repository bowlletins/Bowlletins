import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';
import { Major } from '@prisma/client';

// 1. Extend the Session type to include major and role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      major?: Major;
      role?: string;
    } & DefaultSession['user'];
  }

  // Define what the 'user' object looks like when returned from authorize
  interface User {
    fullName?: string;
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
          user.password
        );
        if (!isValid) return null;

        
        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: '/',
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
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
