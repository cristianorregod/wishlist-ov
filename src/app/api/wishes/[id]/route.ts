import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { canEditWish } from "@/lib/permissions";

const updateWishSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  estimatedPrice: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

async function loadOwnedWish(id: string, userId: string) {
  const [wish] = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
  if (!wish) return { wish: null, allowed: false } as const;
  return { wish, allowed: canEditWish(wish, userId) } as const;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { wish, allowed } = await loadOwnedWish(id, session.user.id);
  if (!wish) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = updateWishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const replacingImage =
    parsed.data.imageUrl && wish.imageUrl && parsed.data.imageUrl !== wish.imageUrl;

  const [updated] = await db
    .update(wishes)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(wishes.id, id))
    .returning();

  if (replacingImage && wish.imageUrl) {
    await del(wish.imageUrl).catch(() => {});
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { wish, allowed } = await loadOwnedWish(id, session.user.id);
  if (!wish) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await db.delete(wishes).where(eq(wishes.id, id));

  if (wish.imageUrl) {
    await del(wish.imageUrl).catch(() => {});
  }

  return new NextResponse(null, { status: 204 });
}
