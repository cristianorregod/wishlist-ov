import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { User } from "@/db/schema";

/**
 * The family is fixed at 3 members (dad, mom, daughter) — there is no
 * multi-tenant user management, so this just resolves who's who.
 */
export async function getFamily(): Promise<{
  dad: User | undefined;
  mom: User | undefined;
  daughter: User | undefined;
}> {
  const all = await db.select().from(users);
  return {
    dad: all.find((u) => u.role === "dad"),
    mom: all.find((u) => u.role === "mom"),
    daughter: all.find((u) => u.role === "daughter"),
  };
}

export async function getPartnerOf(userId: string): Promise<User | undefined> {
  const { dad, mom } = await getFamily();
  if (dad?.id === userId) return mom;
  if (mom?.id === userId) return dad;
  return undefined;
}
