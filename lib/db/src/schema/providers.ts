import { pgTable, serial, text, boolean, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const providersTable = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  description: text("description"),
  website: text("website"),
  featured: boolean("featured").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  rating: real("rating"),
  reviewCount: integer("review_count").notNull().default(0),
  statesAvailable: integer("states_available").notNull().default(0),
  consultationFee: real("consultation_fee"),
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providersTable).omit({ id: true, createdAt: true });
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
