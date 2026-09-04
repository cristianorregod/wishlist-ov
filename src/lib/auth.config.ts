import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js config: no providers here, so this
 * file (and everything it imports) must never touch the database or
 * bcryptjs — it's the config the middleware runs on the Edge runtime.
 * The full config with the Credentials provider lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "dad" | "mom";
      }
      return session;
    },
  },
};
