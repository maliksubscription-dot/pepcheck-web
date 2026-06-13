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
    website: "https://www.forhims.com",
    affiliateUrl: null,
    description: "One of the largest telehealth platforms offering compounded semaglutide and tirzepatide with fast shipping and discreet packaging.",
    featured: true,
    verified: true,
    availableNow: true,
    rating: 4.3,
    reviewCount: 892,
    statesAvailable: 48,
    lastVerified: "2026-06-09",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 149,
    ongoingMonthlyCost: 249,
    avgDeliveryDays: 5,
    pros: [
      "Lowest tirzepatide pricing",
      "Free shipping",
      "Consultation included",
      "Slick app",
    ],
    cons: [
      "Limited vial size options",
      "Less phone support",
    ],
    pharmacyInfo: "Tailor Made Compounding (PCAB-accredited, 503A)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 349, inStock: true, notes: "Includes free shipping and sharps container" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 279, inStock: true, notes: "Monthly subscription available" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "LifeMD (Noom Med)",
    slug: "lifemd",
    website: "https://www.lifemd.com",
    affiliateUrl: null,
    description: "Evidence-based weight management combining GLP-1 medications with behavioral coaching and dietitian support.",
    featured: true,
    verified: true,
    availableNow: true,
    rating: 4.5,
    reviewCount: 1240,
    statesAvailable: 46,
    lastVerified: "2026-06-07",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 199,
    ongoingMonthlyCost: 299,
    avgDeliveryDays: 6,
    pros: [
      "Strong clinical team",
      "50-state coverage",
      "Telehealth includes labs",
    ],
    cons: [
      "Slightly higher price",
      "App could be better",
    ],
    pharmacyInfo: "Strive Pharmacy (503A licensed)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 389, inStock: true, notes: "Bundled with coaching program" },
      { medicationSlug: "tirzepatide", concentrationMgMl: 10, vialSizeMl: 2, pricePerVial: 599, inStock: true, notes: "Higher concentration for maintenance dose" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 299, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Ro Body",
    slug: "ro-body",
    website: "https://www.ro.co",
    affiliateUrl: null,
    description: "Ro offers compounded GLP-1 injections with a strong clinical team, insurance verification, and transparent pricing.",
    featured: true,
    verified: true,
    availableNow: true,
    rating: 4.4,
    reviewCount: 763,
    statesAvailable: 44,
    lastVerified: "2026-06-10",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 199,
    ongoingMonthlyCost: 299,
    avgDeliveryDays: 7,
    pros: [
      "High brand trust",
      "Great UX and app",
      "50-state coverage",
      "Included labs",
    ],
    cons: [
      "Higher price point",
      "Waitlist possible",
    ],
    pharmacyInfo: "Ro-affiliated compounding pharmacy (503A)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 399, inStock: true, notes: "Includes clinical consult fee" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 299, inStock: true },
      { medicationSlug: "semaglutide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 449, inStock: false, notes: "Temporarily out of stock" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Henry Meds",
    slug: "henry-meds",
    website: "https://www.henrymeds.com",
    affiliateUrl: null,
    description: "Subscription-based compounded GLP-1 provider with flat monthly pricing. No insurance required.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.2,
    reviewCount: 589,
    statesAvailable: 45,
    lastVerified: "2026-06-05",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 249,
    ongoingMonthlyCost: 299,
    avgDeliveryDays: 5,
    pros: [
      "503B outsourcing pharmacy",
      "Lowest-dose tirzepatide available",
      "Free shipping",
    ],
    cons: [
      "Newer provider",
      "Fewer reviews",
    ],
    pharmacyInfo: "Olympia Pharmaceuticals (503B FDA-registered)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 299, inStock: true, notes: "Flat monthly pricing model" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 249, inStock: true, notes: "Cheapest in category" },
      { medicationSlug: "liraglutide", concentrationMgMl: 6, vialSizeMl: 3, pricePerVial: 199, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Mochi Health",
    slug: "mochi-health",
    website: "https://www.mochihealth.com",
    affiliateUrl: null,
    description: "Provider-led weight loss program pairing GLP-1 prescriptions with personalized nutrition and exercise plans.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.6,
    reviewCount: 447,
    statesAvailable: 42,
    lastVerified: "2026-06-08",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 249,
    ongoingMonthlyCost: 349,
    avgDeliveryDays: 7,
    pros: [
      "Board-certified obesity physicians",
      "Personalized dosing",
      "Insurance coordination help",
    ],
    cons: [
      "Premium pricing",
      "Longer onboarding",
    ],
    pharmacyInfo: "Empower Pharmacy (503A licensed)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 375, inStock: true },
      { medicationSlug: "tirzepatide", concentrationMgMl: 10, vialSizeMl: 2, pricePerVial: 625, inStock: true, notes: "High-dose protocol" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 289, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Calibrate",
    slug: "calibrate",
    website: "https://www.joincalibrate.com",
    affiliateUrl: null,
    description: "Metabolic health company offering 1-year programs with GLP-1 medications and intensive lifestyle coaching.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.1,
    reviewCount: 312,
    statesAvailable: 40,
    lastVerified: "2026-05-31",
    // Calibrate charges a separate consultation fee
    consultationFee: 99,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 349,
    ongoingMonthlyCost: 449,
    avgDeliveryDays: 10,
    pros: [
      "Comprehensive metabolic program",
      "Insurance partnerships",
      "Behavioral coaching",
    ],
    cons: [
      "Highest price tier",
      "Separate consult fee",
      "Slower delivery",
    ],
    pharmacyInfo: "Multiple accredited 503A compounders",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 425, inStock: true },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 350, inStock: true, notes: "Included in yearly program" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Found",
    slug: "found",
    website: "https://www.joinfound.com",
    affiliateUrl: null,
    description: "Weight care platform prescribing FDA-cleared and compounded GLP-1s with ongoing medical supervision.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.0,
    reviewCount: 276,
    statesAvailable: 43,
    lastVerified: "2026-06-03",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 199,
    ongoingMonthlyCost: 249,
    avgDeliveryDays: 6,
    pros: [
      "Competitive pricing",
      "Good support",
      "Broad state coverage",
    ],
    cons: [
      "Limited medication options",
      "Newer platform",
    ],
    pharmacyInfo: "Belmar Pharmacy (PCAB-accredited, 503A)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 380, inStock: true },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 295, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Sequence",
    slug: "sequence",
    website: "https://www.joinsequence.com",
    affiliateUrl: null,
    description: "Insurance-first GLP-1 platform that helps patients navigate coverage and access compounded alternatives when needed.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 3.9,
    reviewCount: 198,
    statesAvailable: 39,
    lastVerified: "2026-05-29",
    // Sequence charges separately for consultation AND shipping
    consultationFee: 49,
    consultationIncluded: false,
    shippingFee: 19,
    freeShipping: false,
    firstMonthCost: 249,
    ongoingMonthlyCost: 299,
    avgDeliveryDays: 8,
    pros: [
      "Insurance billing expertise",
      "Great for insured patients",
      "Broad drug access",
    ],
    cons: [
      "Separate shipping fee ($19)",
      "Separate consult fee ($49)",
      "Insurance-dependent",
    ],
    pharmacyInfo: "Multiple state-licensed 503A pharmacies",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 410, inStock: true, notes: "Insurance billing support available" },
      { medicationSlug: "semaglutide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 380, inStock: false, notes: "Currently awaiting stock" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Zealthy",
    slug: "zealthy",
    website: "https://www.getzealthy.com",
    affiliateUrl: null,
    description: "Low-cost GLP-1 telehealth with flat monthly memberships and compounded medication access starting at $199/month.",
    featured: true,
    verified: true,
    availableNow: true,
    rating: 4.2,
    reviewCount: 521,
    statesAvailable: 44,
    lastVerified: "2026-06-06",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 149,
    ongoingMonthlyCost: 199,
    avgDeliveryDays: 5,
    pros: [
      "Lowest semaglutide pricing",
      "Fast delivery",
      "No-frills approach",
      "Consultation included",
    ],
    cons: [
      "Limited support resources",
      "Smaller provider base",
    ],
    pharmacyInfo: "Empower Pharmacy (503A licensed)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 249, inStock: true, notes: "Best price guarantee" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 199, inStock: true, notes: "Market-leading price" },
      { medicationSlug: "retatrutide", concentrationMgMl: 2, vialSizeMl: 2, pricePerVial: 499, inStock: true, notes: "Retatrutide available in select states" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Nuvation",
    slug: "nuvation",
    website: "https://www.nuvation.com",
    affiliateUrl: null,
    description: "Specialized compounding-focused telehealth provider offering personalized GLP-1 dosing protocols.",
    featured: false,
    verified: false,       // ← Not yet fully verified by Pepcheck
    availableNow: true,
    rating: 3.7,
    reviewCount: 89,
    statesAvailable: 32,
    lastVerified: "2026-05-22",
    consultationFee: 75,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 299,
    ongoingMonthlyCost: 399,
    avgDeliveryDays: 9,
    pros: [
      "Custom dosing protocols",
      "Specialized obesity medicine team",
    ],
    cons: [
      "Premium pricing",
      "Separate consult fee ($75)",
      "Slower delivery",
      "Less state coverage",
    ],
    pharmacyInfo: "Custom-compound partner (503A)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 320, inStock: true, notes: "Custom dosing protocols available" },
      { medicationSlug: "tirzepatide", concentrationMgMl: 10, vialSizeMl: 4, pricePerVial: 580, inStock: true, notes: "Bulk vial option" },
      { medicationSlug: "retatrutide", concentrationMgMl: 2, vialSizeMl: 2, pricePerVial: 520, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "Sesame",
    slug: "sesame",
    website: "https://www.sesamecare.com",
    affiliateUrl: null,
    description: "Transparent marketplace connecting patients to doctors who can prescribe compounded GLP-1 medications directly.",
    featured: false,
    verified: true,
    availableNow: true,
    rating: 4.3,
    reviewCount: 334,
    statesAvailable: 50,
    lastVerified: "2026-06-04",
    // Sesame charges per doctor visit (not bundled)
    consultationFee: 49,
    consultationIncluded: false,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 189,
    ongoingMonthlyCost: 239,
    avgDeliveryDays: 6,
    pros: [
      "Transparent doctor pricing",
      "50-state coverage",
      "Competitive pricing",
      "Pay-per-visit model",
    ],
    cons: [
      "Doctor charged separately",
      "Pharmacy varies by doctor",
      "Less consistency",
    ],
    pharmacyInfo: "Provider-selected pharmacy (varies by prescribing doctor)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 289, inStock: true, notes: "Price varies by prescribing doctor" },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 239, inStock: true },
      { medicationSlug: "liraglutide", concentrationMgMl: 6, vialSizeMl: 3, pricePerVial: 189, inStock: true },
    ],
  },

  // ──────────────────────────────────────────────────────────
  {
    name: "ShedRx",
    slug: "shedrx",
    website: "https://www.shedrx.com",
    affiliateUrl: null,
    description: "New entrant offering compounded tirzepatide and semaglutide with competitive pricing and quick onboarding.",
    featured: false,
    verified: false,       // ← Not yet fully verified by Pepcheck
    availableNow: true,
    rating: 4.0,
    reviewCount: 143,
    statesAvailable: 38,
    lastVerified: "2026-06-01",
    consultationFee: 0,
    consultationIncluded: true,
    shippingFee: 0,
    freeShipping: true,
    firstMonthCost: 229,
    ongoingMonthlyCost: 279,
    avgDeliveryDays: 5,
    pros: [
      "PCAB-accredited pharmacy",
      "Fast delivery",
      "Consultation included",
      "Good mobile app",
    ],
    cons: [
      "Smaller state coverage",
      "Fewer medication options",
    ],
    pharmacyInfo: "Wells Pharmacy (PCAB-accredited, 503A)",
    listings: [
      { medicationSlug: "tirzepatide", concentrationMgMl: 5, vialSizeMl: 2, pricePerVial: 265, inStock: true },
      { medicationSlug: "semaglutide", concentrationMgMl: 2.5, vialSizeMl: 2, pricePerVial: 215, inStock: true },
    ],
  },

];
