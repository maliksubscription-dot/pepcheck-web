/**
 * ensureSeed — idempotent upsert of all canonical provider data.
 *
 * Safe to call on every startup. Uses slug-based upsert so it never
 * duplicates rows, and replaces listings per-provider on each run.
 */

import { db } from "../index.js";
import { providersTable, listingsTable, medicationsTable } from "../schema/index.js";
import { eq } from "drizzle-orm";
import { providers } from "./providersData.js";

export async function ensureSeed(): Promise<void> {
  const allMeds = await db
    .select({ id: medicationsTable.id, slug: medicationsTable.slug })
    .from(medicationsTable);
  const medIdBySlug = Object.fromEntries(allMeds.map(m => [m.slug, m.id]));

  for (const p of providers) {
    const [upserted] = await db
      .insert(providersTable)
      .values({
        name: p.name,
        slug: p.slug,
        website: p.website,
        affiliateUrl: p.affiliateUrl,
        description: p.description,
        featured: p.featured,
        verified: p.verified,
        availableNow: p.availableNow,
        rating: p.rating,
        reviewCount: p.reviewCount,
        statesAvailable: p.statesAvailable,
        lastVerified: p.lastVerified ? new Date(p.lastVerified) : null,
        consultationFee: p.consultationFee,
        consultationIncluded: p.consultationIncluded,
        shippingFee: p.shippingFee,
        freeShipping: p.freeShipping,
        firstMonthCost: p.firstMonthCost,
        ongoingMonthlyCost: p.ongoingMonthlyCost,
        avgDeliveryDays: p.avgDeliveryDays,
        pros: JSON.stringify(p.pros),
        cons: JSON.stringify(p.cons),
        pharmacyInfo: p.pharmacyInfo,
        bestFor: p.bestFor,
        pepcheckScore: p.pepcheckScore,
        priceTransparency: p.priceTransparency,
        programType: p.programType,
        medicationIncluded: p.medicationIncluded,
      })
      .onConflictDoUpdate({
        target: providersTable.slug,
        set: {
          name: p.name,
          website: p.website,
          affiliateUrl: p.affiliateUrl,
          description: p.description,
          featured: p.featured,
          verified: p.verified,
          availableNow: p.availableNow,
          rating: p.rating,
          reviewCount: p.reviewCount,
          statesAvailable: p.statesAvailable,
          lastVerified: p.lastVerified ? new Date(p.lastVerified) : null,
          consultationFee: p.consultationFee,
          consultationIncluded: p.consultationIncluded,
          shippingFee: p.shippingFee,
          freeShipping: p.freeShipping,
          firstMonthCost: p.firstMonthCost,
          ongoingMonthlyCost: p.ongoingMonthlyCost,
          avgDeliveryDays: p.avgDeliveryDays,
          pros: JSON.stringify(p.pros),
          cons: JSON.stringify(p.cons),
          pharmacyInfo: p.pharmacyInfo,
          bestFor: p.bestFor,
          pepcheckScore: p.pepcheckScore,
          priceTransparency: p.priceTransparency,
          programType: p.programType,
          medicationIncluded: p.medicationIncluded,
        },
      })
      .returning({ id: providersTable.id });

    const providerId = upserted.id;

    await db.delete(listingsTable).where(eq(listingsTable.providerId, providerId));

    if (p.listings.length > 0) {
      for (const listing of p.listings) {
        const medicationId = medIdBySlug[listing.medicationSlug];
        if (!medicationId) continue;
        await db.insert(listingsTable).values({
          providerId,
          medicationId,
          concentrationMgMl: listing.concentrationMgMl,
          vialSizeMl: listing.vialSizeMl,
          pricePerVial: listing.pricePerVial,
          inStock: listing.inStock,
          notes: listing.notes ?? null,
        });
      }
    }
  }
}
