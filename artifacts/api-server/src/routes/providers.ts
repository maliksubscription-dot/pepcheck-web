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
  ListProviderReviewsParams,
  CreateProviderBody,
} from "@workspace/api-zod";

const router = Router();

// GET /providers
router.get("/providers", async (req, res) => {
  const parsed = ListProvidersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { state, medication, sort, featured } = parsed.data;

  const priceSubquery = db
    .select({
      providerId: listingsTable.providerId,
      minPrice: sql<number>`min(${listingsTable.pricePerVial})`.as("min_price"),
      maxPrice: sql<number>`max(${listingsTable.pricePerVial})`.as("max_price"),
    })
    .from(listingsTable)
    .groupBy(listingsTable.providerId)
    .as("prices");

  let query = db
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
      createdAt: providersTable.createdAt,
      minPrice: priceSubquery.minPrice,
      maxPrice: priceSubquery.maxPrice,
    })
    .from(providersTable)
    .leftJoin(priceSubquery, eq(providersTable.id, priceSubquery.providerId));

  const conditions = [];

  if (featured) {
    conditions.push(eq(providersTable.featured, true));
  }

  if (state) {
    const providerIdsInState = db
      .selectDistinct({ id: stateAvailabilityTable.providerId })
      .from(stateAvailabilityTable)
      .where(
        sql`${stateAvailabilityTable.stateCode} = ${state} AND ${stateAvailabilityTable.legalStatus} IN ('legal', 'gray_zone')`
      );
    conditions.push(
      inArray(
        providersTable.id,
        providerIdsInState.as<{ id: number }[]>() as unknown as Parameters<typeof inArray>[1]
      )
    );
  }

  if (medication) {
    const med = await db
      .select()
      .from(medicationsTable)
      .where(eq(medicationsTable.slug, medication))
      .limit(1);
    if (med.length > 0) {
      const providerIds = db
        .selectDistinct({ id: listingsTable.providerId })
        .from(listingsTable)
        .where(eq(listingsTable.medicationId, med[0].id));
      conditions.push(
        inArray(
          providersTable.id,
          providerIds.as<{ id: number }[]>() as unknown as Parameters<typeof inArray>[1]
        )
      );
    }
  }

  // Apply where conditions using raw query building
  let baseQuery;
  if (conditions.length === 0) {
    baseQuery = db
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
        createdAt: providersTable.createdAt,
        minPrice: priceSubquery.minPrice,
        maxPrice: priceSubquery.maxPrice,
      })
      .from(providersTable)
      .leftJoin(priceSubquery, eq(providersTable.id, priceSubquery.providerId));
  } else {
    baseQuery = db
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
        createdAt: providersTable.createdAt,
        minPrice: priceSubquery.minPrice,
        maxPrice: priceSubquery.maxPrice,
      })
      .from(providersTable)
      .leftJoin(priceSubquery, eq(providersTable.id, priceSubquery.providerId))
      .where(sql`${conditions.map((c) => sql`(${c})`).reduce((a, b) => sql`${a} AND ${b}`)}`);
  }

  let rows: typeof baseQuery extends Promise<infer T> ? T : never;
  if (sort === "price_asc") {
    rows = await (baseQuery as typeof query).orderBy(asc(priceSubquery.minPrice)) as typeof rows;
  } else if (sort === "price_desc") {
    rows = await (baseQuery as typeof query).orderBy(desc(priceSubquery.maxPrice)) as typeof rows;
  } else if (sort === "rating_desc") {
    rows = await (baseQuery as typeof query).orderBy(desc(providersTable.rating)) as typeof rows;
  } else if (sort === "featured") {
    rows = await (baseQuery as typeof query).orderBy(desc(providersTable.featured), desc(providersTable.rating)) as typeof rows;
  } else {
    rows = await (baseQuery as typeof query).orderBy(desc(providersTable.featured), desc(providersTable.rating)) as typeof rows;
  }

  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

// GET /providers/featured
router.get("/providers/featured", async (req, res) => {
  const rows = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.featured, true))
    .orderBy(desc(providersTable.rating));

  const priceData = await db
    .select({
      providerId: listingsTable.providerId,
      minPrice: sql<number>`min(${listingsTable.pricePerVial})`,
      maxPrice: sql<number>`max(${listingsTable.pricePerVial})`,
    })
    .from(listingsTable)
    .where(inArray(listingsTable.providerId, rows.map((r) => r.id)))
    .groupBy(listingsTable.providerId);

  const priceMap = new Map(priceData.map((p) => [p.providerId, p]));

  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      minPrice: priceMap.get(r.id)?.minPrice ?? null,
      maxPrice: priceMap.get(r.id)?.maxPrice ?? null,
    }))
  );
});

// GET /providers/compare
router.get("/providers/compare", async (req, res) => {
  const parsed = CompareProvidersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { ids, medication } = parsed.data;
  const idList = ids.split(",").map((id: string) => parseInt(id.trim(), 10)).filter((id: number) => !isNaN(id));

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

  let listingQuery = db
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

  const listings = await listingQuery;

  res.json(
    providers.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
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
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

export default router;
