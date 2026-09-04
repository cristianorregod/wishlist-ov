import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { canCompleteWish } from "@/lib/permissions";

const bodySchema = z.object({ completed: z.boolean() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [wish] = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
  if (!wish) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Never let a user toggle completion on their own wish — that status
  // is exactly the surprise this rule protects, on top of it already
  // being hidden from them in GET /api/wishes.
  if (!canCompleteWish(wish, session.user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(wishes)
    .set(
      parsed.data.completed
        ? {
            status: "completed",
            completedById: session.user.id,
            completedAt: new Date(),
            updatedAt: new Date(),
          }
        : {
            status: "pending",
            completedById: null,
            completedAt: null,
            updatedAt: new Date(),
          }
    )
    .where(eq(wishes.id, id))
    .returning();

  return NextResponse.json(updated);
}
