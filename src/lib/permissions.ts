import type { Wish } from "@/db/schema";

/**
 * Centralizes every access rule for wishes so it is enforced once,
 * server-side, instead of re-derived per route handler.
 */

export function canEditWish(
  wish: Pick<Wish, "createdById">,
  userId: string
): boolean {
  return wish.createdById === userId;
}

export function canCompleteWish(
  wish: Pick<Wish, "forWhomId">,
  userId: string
): boolean {
  // You can never mark your own wish as completed — that field is
  // the surprise we're protecting.
  return wish.forWhomId !== userId;
}

/**
 * Strips the fields that would spoil the surprise when a wish
 * belongs to the requesting user. Never send status/completedBy/
 * completedAt for your own wishes to the client.
 */
export function redactForOwner<T extends Pick<Wish, "forWhomId" | "status" | "completedById" | "completedAt">>(
  wish: T,
  userId: string
): T {
  if (wish.forWhomId !== userId) return wish;
  return {
    ...wish,
    status: "pending",
    completedById: null,
    completedAt: null,
  };
}
