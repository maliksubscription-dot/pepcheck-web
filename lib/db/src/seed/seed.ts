/**
 * Seed script — reads providersData.ts and upserts all providers + listings + reviews into the database.
 *
 * Run with:
 *   pnpm --filter @workspace/db run seed
 *
 * This is safe to run multiple times. It UPSERTS by slug, so existing data
 * is updated rather than duplicated. Listings are replaced per-provider.
 * Seeded reviews are inserted only if no seeded reviews already exist for a provider.
 */

import { db } from "../index.js";
import { providersTable, listingsTable, medicationsTable, reviewsTable } from "../schema/index.js";
import { eq, and } from "drizzle-orm";
import { providers } from "./providersData.js";
import { reviewsByProviderSlug } from "./reviewsData.js";

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

    // 2. Replace listings for this provider
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

    // 3. Seed reviews — only if no seeded reviews exist yet for this provider
    const seedReviews = reviewsByProviderSlug[p.slug];
    let reviewsSeeded = 0;
    if (seedReviews && seedReviews.length > 0) {
      const existing = await db
        .select({ id: reviewsTable.id })
        .from(reviewsTable)
        .where(and(eq(reviewsTable.providerId, providerId), eq(reviewsTable.isSeeded, true)))
        .limit(1);

      if (existing.length === 0) {
        for (const r of seedReviews) {
          await db.insert(reviewsTable).values({
            providerId,
            rating: r.rating,
            comment: r.comment,
            reviewerName: r.reviewerName,
            source: r.source,
            isSeeded: true,
            verified: true,
            createdAt: new Date(r.createdAt),
          });
        }
        reviewsSeeded = seedReviews.length;
      }
    }

    const icon = p.verified ? "✅" : "🔲";
    const reviewNote = reviewsSeeded > 0 ? ` | ${reviewsSeeded} review(s) seeded` : " | reviews already exist";
    console.log(`  ${icon} ${p.name.padEnd(25)} ${p.listings.length} listing(s)${reviewNote}`);
  }

  console.log("\n✅ Seed complete.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
