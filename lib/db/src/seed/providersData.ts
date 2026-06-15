/**
 * ============================================================
 *  PEPCHECK PROVIDER DATA — SINGLE SOURCE OF TRUTH
 * ============================================================
 *
 *  This is the ONE file you edit to update provider information.
 *
 *  After editing, run this command to push your changes to the database:
 *
 *    pnpm --filter @workspace/db run seed
 *
 *  The seed script will UPSERT (insert or update) all providers and
 *  their listings. Existing data is overwritten by slug — nothing is
 *  accidentally deleted unless you remove a provider from this file.
 *
 *  FIELDS GUIDE
 *  ─────────────────────────────────────────────────────────────
 *  Provider-level fields (top of each object):
 *    name               — Display name shown everywhere on the site
 *    slug               — URL-safe identifier. Used in /providers/:slug routes.
 *                         Must be unique. Never change once live (breaks URLs).
 *    website            — The provider's public website URL
 *    affiliateUrl       — Optional affiliate/referral URL. Used for "Visit Provider"
 *                         buttons if set; falls back to website if null.
 *    description        — Short paragraph shown on cards and detail pages
 *    featured           — true = shown in "Featured Providers" strip on homepage
 *    verified           — true = shows "Verified" badge and trust badges
 *    availableNow       — true = shows "Available Now" badge (set false if waitlist)
 *
 *  Ratings & reach:
 *    rating             — Average star rating out of 5 (e.g. 4.3)
 *    reviewCount        — Number of reviews (display only)
 *    statesAvailable    — Number of states this provider ships to (display only)
 *                         The actual per-state legal status is in stateAvailability (DB table).
 *    lastVerified       — Date Pepcheck last verified this provider's data ("YYYY-MM-DD")
 *
 *  Fees & costs:
 *    consultationFee    — One-time or recurring consultation fee in USD (0 if free)
 *    consultationIncluded — true = consultation is bundled in the monthly cost
 *    shippingFee        — Shipping cost in USD (0 if free)
 *    freeShipping       — true = shows "Free Shipping" badge; must match shippingFee: 0
 *    firstMonthCost     — Promotional first-month total cost in USD
 *    ongoingMonthlyCost — Standard monthly cost after any promotions
 *
 *  Logistics:
 *    avgDeliveryDays    — Average business days from order to delivery
 *
 *  Content (displayed on the Overview tab of each provider detail page):
 *    pros               — Array of bullet-point strengths (shown in green)
 *    cons               — Array of bullet-point weaknesses (shown in red)
 *    pharmacyInfo       — Name and accreditation of the compounding pharmacy used
 *
 *  ─────────────────────────────────────────────────────────────
 *  Listings (per-vial pricing for each medication):
 *    Each provider has a "listings" array. Each listing is one
 *    purchasable SKU — a specific medication at a specific vial size
 *    and concentration.
 *
 *    medicationSlug     — Must match a slug in the medications table:
 *                         "tirzepatide" | "semaglutide" | "liraglutide" | "retatrutide"
 *    concentrationMgMl  — Concentration in mg per mL (e.g. 5 means 5 mg/mL)
 *    vialSizeMl         — Vial volume in mL (e.g. 2 means a 2 mL vial)
 *    pricePerVial       — Price in USD for this vial. This is the number shown
 *                         in the comparison table as "Starting at $X"
 *    inStock            — true = "In Stock" badge; false = "Out of Stock"
 *    notes              — Optional short note shown in the pricing table
 * ============================================================
 */

export interface ProviderListing {
  medicationSlug: "tirzepatide" | "semaglutide" | "liraglutide" | "retatrutide";
  concentrationMgMl: number;
  vialSizeMl: number;
  pricePerVial: number;
  inStock: boolean;
  notes?: string;
}

export interface ProviderSeedData {
  // ── Identity ──────────────────────────────────────────────
  /** Display name shown in cards, tables, and detail pages */
  name: string;
  /** URL slug — never change once live. Used in /providers/[slug] */
  slug: string;
  /** Provider's public website */
  website: string;
  /** Affiliate/referral URL — used for "Visit Provider" clicks (null = use website) */
  affiliateUrl: string | null;
  /** Short description shown in cards and the detail page header */
  description: string;

  // ── Flags ─────────────────────────────────────────────────
  /** Show in the Featured Providers section on the homepage */
  featured: boolean;
  /** Show "Verified" badge — Pepcheck has verified this provider's data */
  verified: boolean;
  /** Show "Available Now" badge — set false if provider has a waitlist */
  availableNow: boolean;

  // ── Ratings & reach ───────────────────────────────────────
  /** Average star rating 1–5 */
  rating: number;
  /** Total review count (display only) */
  reviewCount: number;
  /** Number of US states this provider ships to (display only) */
  statesAvailable: number;
  /** Date Pepcheck last verified this provider ("YYYY-MM-DD") */
  lastVerified: string;

  // ── Fees ──────────────────────────────────────────────────
  /** Consultation fee in USD — set 0 if free, but set consultationIncluded: true if bundled */
  consultationFee: number;
  /** true = consultation cost is baked into the monthly price */
  consultationIncluded: boolean;
  /** Shipping cost in USD — must be 0 when freeShipping is true */
  shippingFee: number;
  /** true = shows "Free Shipping" badge */
  freeShipping: boolean;

  // ── Pricing ───────────────────────────────────────────────
  /** Promotional/introductory first-month total cost in USD */
  firstMonthCost: number;
  /** Ongoing monthly cost in USD after any promotions end */
  ongoingMonthlyCost: number;

  // ── Logistics ─────────────────────────────────────────────
  /** Average delivery time in business days */
  avgDeliveryDays: number;

  // ── Content (Overview tab) ────────────────────────────────
  /** Bullet-point list of strengths shown in green on the detail page */
  pros: string[];
  /** Bullet-point list of weaknesses shown in red on the detail page */
  cons: string[];
  /** Compounding pharmacy name and accreditation — shown in the Overview tab */
  pharmacyInfo: string;

  // ── Per-vial pricing ──────────────────────────────────────
  /** All available medication vials for this provider */
  listings: ProviderListing[];
}

// ============================================================
//  PROVIDER DATA
//  Edit any provider below, then run:  pnpm --filter @workspace/db run seed
// ============================================================

export const providers: ProviderSeedData[] = [

  // ──────────────────────────────────────────────────────────
  {
    name: "Hims & Hers",
    slug: "hims-hers",
    website: "https://www.hims.com/weight-loss",
    affiliateUrl: null,
    description: "Large US telehealth platform offering weight-loss care. Hims has shifted toward branded GLP-1 options through Novo Nordisk, with membership fees billed separately from medication costs.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.2,
    reviewCount: 1800,
    statesAvailable: 50,
    lastVerified: "2026-06-15",
    consultationFee: 39,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 39,
    ongoingMonthlyCost: 149,
    avgDeliveryDays: 7,
    pros: [
      "Large national provider",
      "Strong physician network",
      "FDA-approved GLP-1 access",
      "Modern telehealth experience"
    ],
    cons: [
      "Pricing varies significantly",
      "Medication cost not always included",
      "Prescription not guaranteed",
      "Treatment options change frequently"
    ],
    pharmacyInfo: "Provider works with licensed US pharmacies. Medication availability varies.",
    listings: [
    { medicationSlug: "semaglutide", concentrationMgMl: null, vialSizeMl: null, pricePerVial: null, inStock: true, notes: "Membership costs $39 for the first month, then $149/month. Medication is billed separately." },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "LifeMD (Noom Med)",
    slug: "lifemd",
    website: "https://lifemd.com/weight-management",
    affiliateUrl: null,
    description: "National telehealth provider offering physician-led weight management and GLP-1 access.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.3,
    reviewCount: 725,
    statesAvailable: 50,
    lastVerified: "2026-06-15",
    consultationFee: 75,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 75,
    ongoingMonthlyCost: 149,
    avgDeliveryDays: 7,
    pros: [
      "National telehealth platform",
      "GLP-1 weight-management program available",
      "Branded medication options mentioned",
      "Lower first-month care cost",
    ],
    cons: [
      "Medication cost is separate from care membership",
      "Final cost depends on prescription and pharmacy",
      "Insurance coverage may vary",
      "Not all users will qualify for GLP-1 treatment",
    ],
    pharmacyInfo: "Prescription and dispensing depend on provider review and pharmacy availability.",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: null, vialSizeMl: null, pricePerVial: null, inStock: true, notes: "Branded tirzepatide options such as Zepbound/Mounjaro may be available depending on eligibility and prescription." },
      { medicationSlug: "semaglutide", concentrationMgMl: null, vialSizeMl: null, pricePerVial: null, inStock: true, notes: "Program starts at $75/month. Medication cost is separate." },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Ro Body",
    slug: "ro-body",
    website: "https://www.ro.co",
    affiliateUrl: null,
    description: "Ro offers compounded GLP-1 injections with a strong clinical team, insurance verification, and transparent pricing.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.1,
    reviewCount: 1240,
    statesAvailable: 50,
    lastVerified: "2026-06-09",
    consultationFee: 99,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 248,
    ongoingMonthlyCost: 149,
    avgDeliveryDays: 7,
    pros: [
      "No membership fee",
      "Ships to all 50 states",
      "Async consult — no video call needed",
      "Long track record since 2017",
    ],
    cons: [
      "$99 consultation fee first month",
      "No tirzepatide option",
      "less personalised support",
      "Pharmacy partner not pubicly listed",
    ],
    pharmacyInfo: "Licensed 503A compounding pharmacy (name not publicly disclosed)",
    listings: [
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 149, inStock: true, notes: "Month-to-month plan. Lower per-month rate on 3–6 month prepay." },
      { medicationSlug: "semaglutide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 199, inStock: true, notes: "Higher dose band. Includes free shipping." },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Henry Meds",
    slug: "henry-meds",
    website: "https://www.henrymeds.com",
    affiliateUrl: null,
    description: "Affordable medication-forward telehealth platform offering compounded semaglutide in both injectable and oral formats. No coaching — focused purely on prescription access at low cost.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 3.8,
    reviewCount: 2100,
    statesAvailable: 41,
    lastVerified: "2026-06-09",
    consultationFee: 49,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 346,
    ongoingMonthlyCost: 297,
    avgDeliveryDays: 10,
    pros: [
      "Oral semaglutide option available",
      "Injectable and sublingual formats",
      "Pharmacy name disclosed on label",
      "Month-to-month plan available",
    ],
    cons: [
      "FDA warning letter received March 2026",
      "No coaching or lifestyle support",
      "Pricing confusing — not shown upfront",
      "Not available in 9 states including LA, MS, AR",
    ],
    pharmacyInfo: "Tailor Made Compounding (503A — verify current license status)",
    listings: [
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 297, inStock: true, notes: "Weekly injectable. 45-day first shipment cadence." },
      { medicationSlug: "semaglutide", concentrationMgMl: 1, vialSizeMl: 2, pricePerVial: 149, inStock: true, notes: "Oral dissolving tablet option. 90-day supply first shipment." },
    ],
  }

  // ──────────────────────────────────────────────────────────
  {
    name: "PlushCare",
    slug: "plushcare",
    website: "https://plushcare.com/glp-1-prescription",
    affiliateUrl: null,
    description: "Telehealth platform offering online doctor visits for GLP-1 prescriptions and pharmacy price comparison tools. PlushCare focuses on prescriptions through licensed providers rather than simple direct medication checkout.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.4,
    reviewCount: 2100,
    statesAvailable: 50,
    lastVerified: "2026-06-15",
    consultationFee: 129,
    consultationIncluded: false,
    shippingFee: null,
    freeShipping: false,
    firstMonthCost: 129,
    ongoingMonthlyCost: 99,
    avgDeliveryDays: 7,
    pros: [
      "Licensed provider visits",
      "Available across the US",
      "Can help users compare pharmacy prices",
      "Supports multiple GLP-1 medication options",
    ],
    cons: [
      "Medication cost is separate",
      "Appointment cost may vary by insurance",
      "Not a simple flat-rate medication plan",
      "Availability depends on prescription and pharmacy stock",
    ],
    pharmacyInfo: "Medication is filled through pharmacies after provider evaluation and prescription, where appropriate.",
    listings: [
      { medicationSlug: "semaglutide", concentrationMgMl: null, vialSizeMl: null, pricePerVial: null, inStock: true, notes: "PlushCare provides GLP-1 prescription support and pharmacy price tools. Medication cost varies by pharmacy, insurance, and savings options." },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Calibrate",
    slug: "calibrate",
    website: "https://www.joincalibrate.com",
    affiliateUrl: null,
    description: "Premium metabolic health platform combining GLP-1 prescriptions with a full year of curriculum-based coaching, dietitian support, and behaviour change programming.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.2,
    reviewCount: 430,
    statesAvailable: 45,
    lastVerified: "2026-06-09",
    // Calibrate charges a separate consultation fee
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 299,
    ongoingMonthlyCost: 349,
    avgDeliveryDays: 7,
    pros: [
      "Full year coaching and dietitian support",
      "Curriculum-based behaviour change program",
      "Both semaglutide and tirzepatide available",
       "Consultation included in price",
    ],
    cons: [
      "Most expensive option on the market",
      "Requires 1-year commitment",
      "Overkill if you only need medication",
      "Higher barrier to entry",
    ],
    pharmacyInfo: "Licensed 503A compounding pharmacy partners (disclosed on request)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 399, inStock: true, notes: "Premium tier. Dietitian-supported titration included." },
    { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 299, inStock: true, notes: "Includes full coaching programme. 1-year commitment required." },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Found",
    slug: "found",
    website: "https://www.joinfound.com",
    affiliateUrl: null,
    description: "Holistic weight loss platform combining compounded GLP-1 prescriptions with coaching, community, and lifestyle support. One of the few providers that reduces membership cost when insurance is used.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.0,
    reviewCount: 670,
    statesAvailable: 41,
    lastVerified: "2026-06-09",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 159,
    ongoingMonthlyCost: 299,
    avgDeliveryDays: 5,
    pros: [
      "Coaching and community included",
      "Insurance reduces membership fee",
      "Free shipping on compounded meds",
      "Non-GLP-1 medication options too",
    ],
    cons: [
      "Compounded GLP-1 restricted in AL, CA, IA, NE, VA",
      "Total cost unclear upfront",
      "Lab fees charged separately",
      "Not available in AK, AR, DC, DE, LA, MS, RI, VT, WV",
    ],
    pharmacyInfo: "Licensed 503A compounding pharmacy partners (name varies by state)",
    listings: [
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 159, inStock: true, notes: "Starter month pricing. Ongoing cost rises to $299/mo." },
      { medicationSlug: "semaglutide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 299, inStock: true, notes: "Includes coaching and community access." },
    ],
  }

  // ──────────────────────────────────────────────────────────
  {
    name: "Sequence",
    slug: "sequence",
    website: "https://www.joinsequence.com",
    affiliateUrl: null,
      description: "Physician-led GLP-1 telehealth platform now backed by WeightWatchers. Specialises in obesity medicine with board-certified physician oversight and insurance navigation support.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.1,
    reviewCount: 310,
    statesAvailable: 45,
    lastVerified: "2026-06-09",
    // Sequence charges separately for consultation AND shipping
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 299,
    ongoingMonthlyCost: 349,
    avgDeliveryDays: 8,
    pros: [
      "Obesity medicine physician-led care",
      "Insurance navigation included",
      "Both semaglutide and tirzepatide",
      "WW behaviour change tools included",
    ],
    cons: [
      "Higher price point than budget providers",
      "WW integration may not appeal to everyone",
      "Less flexible than medication-only platforms",
      "Boutique model — slower scaling",

    ],
    pharmacyInfo: "Licensed 503A compounding pharmacy partners (varies by state)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 349, inStock: true, notes: "Includes WW lifestyle tools and obesity medicine MD oversight." },
    { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 299, inStock: true, notes: "Physician oversight included. Insurance navigation support." },
    ],
  },

