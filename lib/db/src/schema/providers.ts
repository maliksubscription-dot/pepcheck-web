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
  affiliateUrl: text("affiliate_url"),
  featured: boolean("featured").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  availableNow: boolean("available_now").notNull().default(true),
  rating: real("rating"),
  reviewCount: integer("review_count").notNull().default(0),
  statesAvailable: integer("states_available").notNull().default(0),
  // Fees
  consultationFee: real("consultation_fee"),
  consultationIncluded: boolean("consultation_included").notNull().default(false),
  shippingFee: real("shipping_fee"),
  freeShipping: boolean("free_shipping").notNull().default(false),
  // Costs
  firstMonthCost: real("first_month_cost"),
  ongoingMonthlyCost: real("ongoing_monthly_cost"),
  // Logistics
  avgDeliveryDays: integer("avg_delivery_days"),
  // Content (stored as JSON strings)
  pros: text("pros"),
  cons: text("cons"),
  pharmacyInfo: text("pharmacy_info"),
  // Pepcheck editorial
  bestFor: text("best_for"),
  pepcheckScore: real("pepcheck_score"),
  priceTransparency: text("price_transparency"),
  programType: text("program_type"),
  medicationIncluded: boolean("medication_included").default(false),
  // Metadata
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providersTable).omit({ id: true, createdAt: true });
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
