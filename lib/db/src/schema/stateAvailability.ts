import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { providersTable } from "./providers";

export const stateAvailabilityTable = pgTable("state_availability", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providersTable.id, { onDelete: "cascade" }),
  stateCode: text("state_code").notNull(),
  stateName: text("state_name").notNull(),
  legalStatus: text("legal_status").notNull().default("legal"),
  notes: text("notes"),
});

export const insertStateAvailabilitySchema = createInsertSchema(stateAvailabilityTable).omit({ id: true });
export type InsertStateAvailability = z.infer<typeof insertStateAvailabilitySchema>;
export type StateAvailability = typeof stateAvailabilityTable.$inferSelect;
