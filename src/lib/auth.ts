import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        userId: {},
        password: {},
      },
      authorize: async (credentials) => {
        const userId = credentials?.userId as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!userId || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        // No password hash means this person (e.g. the daughter)
        // is not allowed to log in at all.
        if (!user || !user.passwordHash) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
});
