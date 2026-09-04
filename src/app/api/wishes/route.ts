import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { wishes } from "@/db/schema";
import { getFamily } from "@/lib/family";
import { redactForOwner } from "@/lib/permissions";

const scopeSchema = z.enum(["mine", "partner", "daughter"]);

const createWishSchema = z.object({
  forWhom: z.enum(["mine", "daughter"]),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  estimatedPrice: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsedScope = scopeSchema.safeParse(searchParams.get("scope"));
  if (!parsedScope.success) {
    return NextResponse.json({ error: "invalid scope" }, { status: 400 });
  }

  const family = await getFamily();
  const targetId =
    parsedScope.data === "mine"
      ? session.user.id
      : parsedScope.data === "daughter"
        ? family.daughter?.id
        : family.dad?.id === session.user.id
          ? family.mom?.id
          : family.dad?.id;

  if (!targetId) {
    return NextResponse.json({ error: "family not seeded" }, { status: 500 });
  }

  const rows = await db
    .select()
    .from(wishes)
    .where(eq(wishes.forWhomId, targetId));

  const result = rows.map((wish) => redactForOwner(wish, session.user.id));
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createWishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const family = await getFamily();
  const forWhomId =
    parsed.data.forWhom === "mine" ? session.user.id : family.daughter?.id;

  if (!forWhomId) {
    return NextResponse.json({ error: "family not seeded" }, { status: 500 });
  }

  const [created] = await db
    .insert(wishes)
    .values({
      forWhomId,
      createdById: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      estimatedPrice: parsed.data.estimatedPrice,
      imageUrl: parsed.data.imageUrl,
      priority: parsed.data.priority,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
