import { Router } from "express";
import { db } from "@workspace/db";
import { stateAvailabilityTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// GET /states
router.get("/states", async (req, res) => {
  const rows = await db
    .select({
      code: stateAvailabilityTable.stateCode,
      name: stateAvailabilityTable.stateName,
      providerCount: sql<number>`count(distinct ${stateAvailabilityTable.providerId})`,
      legalStatusSummary: sql<string>`
        CASE
          WHEN COUNT(DISTINCT CASE WHEN ${stateAvailabilityTable.legalStatus} = 'legal' THEN ${stateAvailabilityTable.providerId} END) > 0
            AND COUNT(DISTINCT CASE WHEN ${stateAvailabilityTable.legalStatus} != 'legal' THEN ${stateAvailabilityTable.providerId} END) > 0
          THEN 'mixed'
          WHEN COUNT(DISTINCT CASE WHEN ${stateAvailabilityTable.legalStatus} = 'legal' THEN ${stateAvailabilityTable.providerId} END) = COUNT(DISTINCT ${stateAvailabilityTable.providerId})
          THEN 'legal'
          WHEN COUNT(DISTINCT CASE WHEN ${stateAvailabilityTable.legalStatus} = 'gray_zone' THEN ${stateAvailabilityTable.providerId} END) > 0
          THEN 'gray_zone'
          WHEN COUNT(DISTINCT CASE WHEN ${stateAvailabilityTable.legalStatus} = 'restricted' THEN ${stateAvailabilityTable.providerId} END) > 0
          THEN 'restricted'
          ELSE 'unavailable'
        END
      `,
    })
    .from(stateAvailabilityTable)
    .groupBy(stateAvailabilityTable.stateCode, stateAvailabilityTable.stateName)
    .orderBy(stateAvailabilityTable.stateName);

  res.json(
    rows.map((r) => ({
      ...r,
      providerCount: Number(r.providerCount),
    }))
  );
});

export default router;
