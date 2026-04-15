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
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName, // Map database fullName to standard 'name'
          image: user.image,
          major: user.major as Major,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // Runs on Sign In
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.fullName;
        token.image = user.image;
        token.major = user.major;
      }

      // Runs when you call update() in ProfileSettings
      if (trigger === 'update' && session) {
      // These checks ensure that if you send an empty string, it's ignored
      if (session.fullName?.trim()) token.name = session.fullName.trim();
      if (session.name?.trim())     token.name = session.name.trim();
      if (session.image)            token.image = session.image;
      if (session.major)            token.major = session.major;
    }
    
    return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.major = token.major as Major;
      }
      return session;
    },
  },
});