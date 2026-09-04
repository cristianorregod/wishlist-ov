import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "dad" | "mom";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "dad" | "mom" | "daughter";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "dad" | "mom" | "daughter";
  }
}
