import { Router } from "express";
import { db } from "@workspace/db";
import {
  providersTable,
  listingsTable,
  stateAvailabilityTable,
  reviewsTable,
  medicationsTable,
} from "@workspace/db";
import { eq, inArray, sql, asc, desc } from "drizzle-orm";
import {
  ListProvidersQueryParams,
  CompareProvidersQueryParams,
  GetProviderParams,
  GetProviderListingsParams,
  CreateProviderBody,
} from "@workspace/api-zod";

const router = Router();

async function getProvidersWithPrices(
  providerIds?: number[],
  sort?: string
) {
  let baseQuery = db
    .select({
      id: providersTable.id,
      name: providersTable.name,
      slug: providersTable.slug,
      logoUrl: providersTable.logoUrl,
      description: providersTable.description,
      website: providersTable.website,
      featured: providersTable.featured,
      verified: providersTable.verified,
      rating: providersTable.rating,
      reviewCount: providersTable.reviewCount,
      statesAvailable: providersTable.statesAvailable,
      consultationFee: providersTable.consultationFee,
      lastVerified: providersTable.lastVerified,
      createdAt: providersTable.createdAt,
      minPrice: sql<number | null>`min(${listingsTable.pricePerVial})`,
      maxPrice: sql<number | null>`max(${listingsTable.pricePerVial})`,
    })
    .from(providersTable)
    .leftJoin(listingsTable, eq(listingsTable.providerId, providersTable.id))
    .$dynamic();

  if (providerIds && providerIds.length > 0) {
    baseQuery = baseQuery.where(inArray(providersTable.id, providerIds));
  }

  baseQuery = baseQuery.groupBy(
    providersTable.id,
    providersTable.name,
    providersTable.slug,
    providersTable.logoUrl,
    providersTable.description,
    providersTable.website,
    providersTable.featured,
    providersTable.verified,
    providersTable.rating,
    providersTable.reviewCount,
    providersTable.statesAvailable,
    providersTable.consultationFee,
    providersTable.lastVerified,
    providersTable.createdAt
  );

  if (sort === "price_asc") {
    baseQuery = baseQuery.orderBy(asc(sql`min(${listingsTable.pricePerVial})`));
  } else if (sort === "price_desc") {
    baseQuery = baseQuery.orderBy(desc(sql`max(${listingsTable.pricePerVial})`));
  } else if (sort === "rating_desc") {
    baseQuery = baseQuery.orderBy(desc(providersTable.rating));
  } else {
    baseQuery = baseQuery.orderBy(desc(providersTable.featured), desc(providersTable.rating));
  }

  const rows = await baseQuery;
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    lastVerified: r.lastVerified ? r.lastVerified.toISOString() : null,
  }));
}

// GET /providers
router.get("/providers", async (req, res) => {
  const parsed = ListProvidersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { state, medication, sort, featured } = parsed.data;

  // Collect all filter sets as arrays of IDs
  let allowedIds: Set<number> | null = null;

  if (featured) {
    const rows = await db.select({ id: providersTable.id }).from(providersTable).where(eq(providersTable.featured, true));
    allowedIds = new Set(rows.map((r) => r.id));
  }

  if (state) {
    const rows = await db
      .selectDistinct({ id: stateAvailabilityTable.providerId })
      .from(stateAvailabilityTable)
      .where(
        sql`${stateAvailabilityTable.stateCode} = ${state} AND ${stateAvailabilityTable.legalStatus} IN ('legal', 'gray_zone')`
      );
    const ids = new Set(rows.map((r) => r.id));
    allowedIds = allowedIds ? new Set([...allowedIds].filter((id) => ids.has(id))) : ids;
  }

  if (medication) {
    const med = await db
      .select()
      .from(medicationsTable)
      .where(eq(medicationsTable.slug, medication))
      .limit(1);
    if (med.length > 0) {
      const rows = await db
        .selectDistinct({ id: listingsTable.providerId })
        .from(listingsTable)
        .where(eq(listingsTable.medicationId, med[0].id));
      const ids = new Set(rows.map((r) => r.id));
      allowedIds = allowedIds ? new Set([...allowedIds].filter((id) => ids.has(id))) : ids;
    } else {
      res.json([]);
      return;
    }
  }

  const providerIds = allowedIds ? [...allowedIds] : undefined;
  if (providerIds && providerIds.length === 0) {
    res.json([]);
    return;
  }

  const rows = await getProvidersWithPrices(providerIds, sort);
  res.json(rows);
});

// GET /providers/featured
router.get("/providers/featured", async (req, res) => {
  const featuredIds = await db
    .select({ id: providersTable.id })
    .from(providersTable)
    .where(eq(providersTable.featured, true));

  if (featuredIds.length === 0) {
    res.json([]);
    return;
  }

  const rows = await getProvidersWithPrices(featuredIds.map((r) => r.id), "featured");
  res.json(rows);
});

// GET /providers/compare
router.get("/providers/compare", async (req, res) => {
  const parsed = CompareProvidersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { ids } = parsed.data;
  const idList = ids
    .split(",")
    .map((id: string) => parseInt(id.trim(), 10))
    .filter((id: number) => !isNaN(id));

  if (idList.length === 0) {
    res.json([]);
    return;
  }

  const providers = await db
    .select()
    .from(providersTable)
    .where(inArray(providersTable.id, idList));

  const stateData = await db
    .select()
    .from(stateAvailabilityTable)
    .where(inArray(stateAvailabilityTable.providerId, idList));

  const listings = await db
    .select({
      id: listingsTable.id,
      providerId: listingsTable.providerId,
      medicationId: listingsTable.medicationId,
      medicationName: medicationsTable.name,
      medicationSlug: medicationsTable.slug,
      concentrationMgMl: listingsTable.concentrationMgMl,
      vialSizeMl: listingsTable.vialSizeMl,
      pricePerVial: listingsTable.pricePerVial,
      inStock: listingsTable.inStock,
      notes: listingsTable.notes,
      updatedAt: listingsTable.updatedAt,
    })
    .from(listingsTable)
    .innerJoin(medicationsTable, eq(listingsTable.medicationId, medicationsTable.id))
    .where(inArray(listingsTable.providerId, idList));

  res.json(
    providers.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      lastVerified: p.lastVerified ? p.lastVerified.toISOString() : null,
      listings: listings
        .filter((l) => l.providerId === p.id)
        .map((l) => ({ ...l, updatedAt: l.updatedAt.toISOString() })),
      stateAvailability: stateData.filter((s) => s.providerId === p.id),
    }))
  );
});

// GET /providers/:id
router.get("/providers/:id", async (req, res) => {
  const parsed = GetProviderParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const provider = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.id, parsed.data.id))
    .limit(1);

  if (provider.length === 0) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }

  const listings = await db
    .select({
      id: listingsTable.id,
      providerId: listingsTable.providerId,
      medicationId: listingsTable.medicationId,
      medicationName: medicationsTable.name,
      medicationSlug: medicationsTable.slug,
      concentrationMgMl: listingsTable.concentrationMgMl,
      vialSizeMl: listingsTable.vialSizeMl,
      pricePerVial: listingsTable.pricePerVial,
      inStock: listingsTable.inStock,
      notes: listingsTable.notes,
      updatedAt: listingsTable.updatedAt,
    })
    .from(listingsTable)
    .innerJoin(medicationsTable, eq(listingsTable.medicationId, medicationsTable.id))
    .where(eq(listingsTable.providerId, parsed.data.id));

  const stateAvailability = await db
    .select()
    .from(stateAvailabilityTable)
    .where(eq(stateAvailabilityTable.providerId, parsed.data.id));

  const p = provider[0];
  res.json({
    ...p,
    createdAt: p.createdAt.toISOString(),
    lastVerified: p.lastVerified ? p.lastVerified.toISOString() : null,
    listings: listings.map((l) => ({ ...l, updatedAt: l.updatedAt.toISOString() })),
    stateAvailability,
  });
});

// GET /providers/:id/listings
router.get("/providers/:id/listings", async (req, res) => {
  const parsed = GetProviderListingsParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const listings = await db
    .select({
      id: listingsTable.id,
      providerId: listingsTable.providerId,
      medicationId: listingsTable.medicationId,
      medicationName: medicationsTable.name,
      medicationSlug: medicationsTable.slug,
      concentrationMgMl: listingsTable.concentrationMgMl,
      vialSizeMl: listingsTable.vialSizeMl,
      pricePerVial: listingsTable.pricePerVial,
      inStock: listingsTable.inStock,
      notes: listingsTable.notes,
      updatedAt: listingsTable.updatedAt,
    })
    .from(listingsTable)
    .innerJoin(medicationsTable, eq(listingsTable.medicationId, medicationsTable.id))
    .where(eq(listingsTable.providerId, parsed.data.id));

  res.json(listings.map((l) => ({ ...l, updatedAt: l.updatedAt.toISOString() })));
});

// POST /providers
router.post("/providers", async (req, res) => {
  const parsed = CreateProviderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [created] = await db.insert(providersTable).values(parsed.data).returning();
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString(), lastVerified: null });
});

export default router;
