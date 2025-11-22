// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

/** @type {import("next-auth").NextAuthOptions} */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials ?? {};
        if (!username || !password) return null;

        // const prisma = prisma();

        try {
          // NOTE: `username` maps to `Client.username` (unique in MSSQL)
          const client = await prisma.client.findUnique({
            where: { username },
            select: {
              clientId: true,
              passwordHash: true,
              companyName: true,
            },
          });

          if (!client) return null;

          const passwordsMatch = await bcrypt.compare(password, client.passwordHash);
          if (!passwordsMatch) return null;

          // Return shape expected by NextAuth
          return {
            id: client.clientId.toString(),          // <-- PK as string
            username: username,
            name: client.companyName ?? undefined,
          };
        } catch (err) {
          console.error("NextAuth authorize error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 h
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
};

// NextAuth handler (App Router)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };