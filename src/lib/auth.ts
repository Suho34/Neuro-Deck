import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    // --- Google ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // --- GitHub ---
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  // Session handling
  session: {
    strategy: "jwt", // store in JWT (stateless)
  },

  pages: {
    signIn: "/sign-in", // custom signin page
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
};

export default authOptions;
