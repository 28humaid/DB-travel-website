import { connectMongoDB } from "@/lib/mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userAuth";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials;
        try {
          await connectMongoDB();
          const user = await User.findOne({ username });
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          // Return user with role
          return { id: user._id.toString(), username: user.username};
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    // maxAge: 2 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
        // Initial sign-in: Add user data to token
        if (user) {
        console.log("JWT callback - Adding user to token:", user);
        token.id = user.id;
        token.username = user.username;
        // token.role = user.role;  // Uncomment/add if adding roles to schema
        }
        return token;
    },
    async session({ session, token }) {
        // Every session access: Add token data to session
        console.log("Session callback - token:", token);
        if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        // session.user.role = token.role;  // Uncomment if using roles
        }
        console.log("Final session:", session);
        return session;
    },
    },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };