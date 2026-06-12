import { Router } from "express";
import { db } from "@workspace/db";
import { medicationsTable, listingsTable } from "@workspace/db";
import { eq, min, max, avg, count, sql } from "drizzle-orm";
import { GetMedicationPriceRangeQueryParams } from "@workspace/api-zod";

const router = Router();

// GET /medications
router.get("/medications", async (req, res) => {
  const meds = await db.select().from(medicationsTable).orderBy(medicationsTable.name);
  res.json(meds);
});

// GET /medications/price-range
router.get("/medications/price-range", async (req, res) => {
  const parsed = GetMedicationPriceRangeQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }

  const { medication } = parsed.data;

  const med = await db
    .select()
    .from(medicationsTable)
    .where(eq(medicationsTable.slug, medication))
    .limit(1);

  if (med.length === 0) {
    res.status(404).json({ error: "Medication not found" });
    return;
  }

  const [stats] = await db
    .select({
      minPrice: min(listingsTable.pricePerVial),
      maxPrice: max(listingsTable.pricePerVial),
      avgPrice: avg(listingsTable.pricePerVial),
      providerCount: count(sql`DISTINCT ${listingsTable.providerId}`),
    })
    .from(listingsTable)
    .where(eq(listingsTable.medicationId, med[0].id));

  res.json({
    medicationSlug: medication,
    minPrice: Number(stats.minPrice ?? 0),
    maxPrice: Number(stats.maxPrice ?? 0),
    avgPrice: Number(stats.avgPrice ?? 0),
    providerCount: Number(stats.providerCount ?? 0),
  });
});

export default router;
