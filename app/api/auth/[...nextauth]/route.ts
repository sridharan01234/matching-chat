import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github'

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
