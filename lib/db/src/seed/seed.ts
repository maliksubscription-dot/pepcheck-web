/**
 * Seed script — reads providersData.ts and upserts all providers + listings into the database.
 *
 * Run with:
 *   pnpm --filter @workspace/db run seed
 *
 * This is safe to run multiple times. It UPSERTS by slug, so existing data
 * is updated rather than duplicated. Listings are replaced per-provider.
 */

import { db } from "../index.js";
import { providersTable, listingsTable, medicationsTable } from "../schema/index.js";
import { eq } from "drizzle-orm";
import { providers } from "./providersData.js";

async function seed() {
  console.log(`\n🌱 Seeding ${providers.length} providers...\n`);

  // Fetch medication slugs → ids once upfront
  const allMeds = await db.select({ id: medicationsTable.id, slug: medicationsTable.slug }).from(medicationsTable);
  const medIdBySlug = Object.fromEntries(allMeds.map(m => [m.slug, m.id]));

  for (const p of providers) {
    // 1. Upsert provider row
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
        },
      })
      .returning({ id: providersTable.id });

    const providerId = upserted.id;

    // 2. Replace listings for this provider
    //    Delete existing listings first, then insert fresh ones.
    await db.delete(listingsTable).where(eq(listingsTable.providerId, providerId));

    if (p.listings.length > 0) {
      for (const listing of p.listings) {
        const medicationId = medIdBySlug[listing.medicationSlug];
        if (!medicationId) {
          console.warn(`  ⚠️  Unknown medicationSlug "${listing.medicationSlug}" for provider "${p.name}" — skipping listing`);
          continue;
        }
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

    const icon = p.verified ? "✅" : "🔲";
    console.log(`  ${icon} ${p.name.padEnd(25)} ${p.listings.length} listing(s)`);
  }

  console.log("\n✅ Seed complete.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
