import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  role: text("role", { enum: ["dad", "mom", "daughter"] }).notNull(),
  // null = this person cannot log in (the daughter's case)
  passwordHash: text("password_hash"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const wishes = sqliteTable("wishes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  forWhomId: text("for_whom_id")
    .notNull()
    .references(() => users.id),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  estimatedPrice: integer("estimated_price").notNull(),
  imageUrl: text("image_url"),
  priority: text("priority", { enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  status: text("status", { enum: ["pending", "completed"] })
    .notNull()
    .default("pending"),
  completedById: text("completed_by_id").references(() => users.id),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type Wish = typeof wishes.$inferSelect;
export type NewWish = typeof wishes.$inferInsert;
