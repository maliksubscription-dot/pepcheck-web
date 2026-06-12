import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListProviderReviewsParams, SubmitReviewBody } from "@workspace/api-zod";

const router = Router();

// GET /providers/:id/reviews
router.get("/providers/:id/reviews", async (req, res) => {
  const parsed = ListProviderReviewsParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.providerId, parsed.data.id))
    .orderBy(reviewsTable.createdAt);

  res.json(reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// POST /reviews
router.post("/reviews", async (req, res) => {
  const parsed = SubmitReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [created] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, verified: false })
    .returning();

  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

export default router;
