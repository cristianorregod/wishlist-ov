import { isNull, not } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const loginableUsers = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(not(isNull(users.passwordHash)));

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-9">
      <div className="w-full max-w-sm">
        <LoginForm users={loginableUsers} />
      </div>
    </main>
  );
}
