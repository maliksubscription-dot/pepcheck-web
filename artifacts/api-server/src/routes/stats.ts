import { Router } from "express";
import { db } from "@workspace/db";
import {
  providersTable,
  medicationsTable,
  listingsTable,
  reviewsTable,
  stateAvailabilityTable,
} from "@workspace/db";
import { count, avg, sql } from "drizzle-orm";
import { TrackProviderClickBody } from "@workspace/api-zod";

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
  const [priceStats] = await db.select({ avgPrice: avg(listingsTable.pricePerVial) }).from(listingsTable);

  const stateCount = await db
    .selectDistinct({ code: stateAvailabilityTable.stateCode })
    .from(stateAvailabilityTable)
    .where(sql`${stateAvailabilityTable.legalStatus} IN ('legal', 'gray_zone')`);

  const popularMeds = await db
    .select({
      slug: medicationsTable.slug,
      name: medicationsTable.name,
      providerCount: sql<number>`COUNT(DISTINCT ${listingsTable.providerId})`,
    })
    .from(medicationsTable)
    .leftJoin(listingsTable, sql`${listingsTable.medicationId} = ${medicationsTable.id}`)
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

// POST /track/click
router.post("/track/click", async (req, res) => {
  const parsed = TrackProviderClickBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  req.log.info({ providerId: parsed.data.providerId, source: parsed.data.source }, "provider_click");
  res.json({ status: "ok" });
});

export default router;
