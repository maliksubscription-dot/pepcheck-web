import { pgTable, serial, integer, real, boolean, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { providersTable } from "./providers";
import { medicationsTable } from "./medications";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providersTable.id, { onDelete: "cascade" }),
  medicationId: integer("medication_id").notNull().references(() => medicationsTable.id, { onDelete: "cascade" }),
  concentrationMgMl: real("concentration_mg_ml").notNull(),
  vialSizeMl: real("vial_size_ml").notNull(),
  pricePerVial: real("price_per_vial").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
