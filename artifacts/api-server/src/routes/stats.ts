import { Router } from "express";
import { db } from "@workspace/db";
import {
  providersTable,
  medicationsTable,
  listingsTable,
  reviewsTable,
  stateAvailabilityTable,
} from "@workspace/db";
import { eq, count, avg, sql } from "drizzle-orm";

const router = Router();

// GET /stats
router.get("/stats", async (req, res) => {
  const [providerStats] = await db
    .select({
      total: count(),
      verified: sql<number>`COUNT(CASE WHEN ${providersTable.verified} = true THEN 1 END)`,
    })
    .from(providersTable);

  const [medCount] = await db.select({ total: count() }).from(medicationsTable);

  const [reviewCount] = await db.select({ total: count() }).from(reviewsTable);

  const [priceStats] = await db
    .select({ avgPrice: avg(listingsTable.pricePerVial) })
    .from(listingsTable);

  const stateCount = await db
    .selectDistinct({ code: stateAvailabilityTable.stateCode })
    .from(stateAvailabilityTable)
    .where(
      sql`${stateAvailabilityTable.legalStatus} IN ('legal', 'gray_zone')`
    );

  const popularMeds = await db
    .select({
      slug: medicationsTable.slug,
      name: medicationsTable.name,
      providerCount: sql<number>`COUNT(DISTINCT ${listingsTable.providerId})`,
    })
    .from(medicationsTable)
    .leftJoin(listingsTable, eq(listingsTable.medicationId, medicationsTable.id))
    .groupBy(medicationsTable.id, medicationsTable.slug, medicationsTable.name)
    .orderBy(sql`COUNT(DISTINCT ${listingsTable.providerId}) DESC`)
    .limit(5);

  res.json({
    totalProviders: Number(providerStats.total),
    verifiedProviders: Number(providerStats.verified),
    totalMedications: Number(medCount.total),
    totalReviews: Number(reviewCount.total),
    avgPricePerVial: Number(priceStats.avgPrice ?? 0),
    statesCovered: stateCount.length,
    popularMedications: popularMeds.map((m) => ({
      ...m,
      providerCount: Number(m.providerCount),
    })),
  });
});

export default router;
