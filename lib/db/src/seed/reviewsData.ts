export interface ReviewSeedEntry {
  reviewerName: string;
  rating: number;
  comment: string;
  source: "Trustpilot" | "Google";
  createdAt: string;
}

export const reviewsByProviderSlug: Record<string, ReviewSeedEntry[]> = {

  "hims-hers": [
    {
      reviewerName: "Sarah M.",
      rating: 5,
      comment: "The app is super easy to use and my doctor responded within a day. Prescription was approved quickly and I had medication within a week. Lost 18 lbs in my first 3 months — really happy with how smooth the process was.",
      source: "Trustpilot",
      createdAt: "2026-03-15",
    },
    {
      reviewerName: "James T.",
      rating: 3,
      comment: "Make sure you understand the full cost breakdown before signing up. The membership fee is just the start — medication is billed separately, which added up more than I expected. The platform itself is fine but pricing wasn't clear upfront.",
      source: "Google",
      createdAt: "2026-02-01",
    },
    {
      reviewerName: "Rachel K.",
      rating: 5,
      comment: "I was nervous about starting GLP-1 treatment but Hims made it easy. The medical team was professional and responsive. Down 22 lbs in 4 months and feeling great.",
      source: "Trustpilot",
      createdAt: "2025-12-10",
    },
    {
      reviewerName: "Mike D.",
      rating: 4,
      comment: "Good telehealth provider overall. Strong physician network and everything is done through the app. Just be prepared for the total cost to be higher than the membership fee — medication is a separate charge.",
      source: "Trustpilot",
      createdAt: "2025-10-20",
    },
    {
      reviewerName: "Linda P.",
      rating: 4,
      comment: "Responsive team and straightforward prescription process. My prescription was handled professionally and delivery was on time. Would recommend for anyone new to GLP-1 treatment.",
      source: "Google",
      createdAt: "2026-01-05",
    },
  ],

  "lifemd": [
    {
      reviewerName: "Amanda C.",
      rating: 5,
      comment: "My doctor called within 48 hours of signing up — super professional and thorough. They went through my full health history before prescribing anything. This felt like real medical care, not just a prescription vending machine.",
      source: "Trustpilot",
      createdAt: "2026-04-10",
    },
    {
      reviewerName: "David R.",
      rating: 4,
      comment: "The $75 consultation fee is worth it for the physician-led approach. You're actually speaking to a doctor, not just chatting with an AI or filling out a form. Medication arrived within the week after approval.",
      source: "Trustpilot",
      createdAt: "2026-02-20",
    },
    {
      reviewerName: "Jennifer W.",
      rating: 5,
      comment: "Lost 22 lbs over 4 months with great support from the medical team throughout. They adjusted my dose when I needed it and were always available for questions. Best decision I made for my health.",
      source: "Google",
      createdAt: "2025-11-15",
    },
    {
      reviewerName: "Tom B.",
      rating: 3,
      comment: "The platform is well designed and the doctors are good. My main frustration was the medication cost being separate — I expected everything to be included in the monthly fee. Read the pricing carefully before signing up.",
      source: "Trustpilot",
      createdAt: "2025-12-01",
    },
    {
      reviewerName: "Nicole S.",
      rating: 4,
      comment: "Smooth onboarding and my prescription was approved within two days. The physician was knowledgeable and answered all my questions. A reliable option if you want proper doctor oversight.",
      source: "Google",
      createdAt: "2026-03-08",
    },
  ],

  "ro-body": [
    {
      reviewerName: "Maria L.",
      rating: 5,
      comment: "Not needing a video call was a huge plus for me — the async consultation meant I could submit my forms in the evening and get a response by morning. Medication arrived within 7 days. Clear pricing too, no surprises.",
      source: "Trustpilot",
      createdAt: "2026-05-01",
    },
    {
      reviewerName: "Chris H.",
      rating: 4,
      comment: "The $99 consultation fee on the first month is a bit of a sting, but after that the ongoing cost is very reasonable and everything is transparent. I always know exactly what I'm paying. Down 27 lbs in 5 months.",
      source: "Trustpilot",
      createdAt: "2026-03-22",
    },
    {
      reviewerName: "Ashley F.",
      rating: 5,
      comment: "Been on compounded semaglutide through Ro for 6 months and down 30 lbs. The process was seamless from start to finish and my medication has arrived consistently on time every month. Highly recommend.",
      source: "Google",
      createdAt: "2025-09-14",
    },
    {
      reviewerName: "Kevin M.",
      rating: 3,
      comment: "Really solid service overall, my only gripe is that they only offer semaglutide and not tirzepatide. If that's what you need, look elsewhere. Otherwise the platform is well run and pricing is genuinely clear.",
      source: "Trustpilot",
      createdAt: "2026-01-18",
    },
    {
      reviewerName: "Samantha G.",
      rating: 4,
      comment: "The async consultation is a game-changer for people with busy schedules. No need to book time off work or find childcare for a video call. Approved in under 24 hours. Really impressed.",
      source: "Google",
      createdAt: "2026-04-05",
    },
  ],

  "henry-meds": [
    {
      reviewerName: "Paul Z.",
      rating: 4,
      comment: "Cheapest compounded semaglutide I could find anywhere. The platform is basic but it works. No coaching or lifestyle support, but I didn't want that — just medication at a fair price. Does exactly what it says.",
      source: "Trustpilot",
      createdAt: "2025-11-20",
    },
    {
      reviewerName: "Donna H.",
      rating: 3,
      comment: "I wish the pricing was shown more clearly upfront. I only found out the full cost after going through most of the sign-up process. The medication itself has been fine once it arrived, but the experience needs work.",
      source: "Google",
      createdAt: "2026-01-30",
    },
    {
      reviewerName: "Brian N.",
      rating: 2,
      comment: "Customer service was slow to respond when I had questions about my order. It took over 48 hours to get a reply to a billing question. The medication eventually arrived but the experience left a lot to be desired.",
      source: "Trustpilot",
      createdAt: "2026-02-15",
    },
    {
      reviewerName: "Cindy L.",
      rating: 5,
      comment: "The oral semaglutide tablet option is unique — I couldn't find it anywhere else at this price point. It's been working well for me and the convenience of not injecting is a big deal. Genuinely happy with Henry Meds.",
      source: "Google",
      createdAt: "2025-10-05",
    },
    {
      reviewerName: "Robert K.",
      rating: 4,
      comment: "Pure medication focus with no coaching or extras — which is exactly what I wanted. I do my own research and just needed a reliable prescription source. Henry Meds delivers on that.",
      source: "Trustpilot",
      createdAt: "2025-12-18",
    },
  ],

  "plushcare": [
    {
      reviewerName: "Emma J.",
      rating: 5,
      comment: "The doctor I saw was excellent — she actually listened to my health history and explained the options clearly. Same-day appointment was available and I had a prescription within hours. Really impressive service.",
      source: "Trustpilot",
      createdAt: "2026-04-25",
    },
    {
      reviewerName: "Mark T.",
      rating: 4,
      comment: "Easy to book a same-day appointment which I appreciated. The doctor was thorough and professional. Since medication is filled at your own pharmacy, you do need to sort that part out yourself, but the care side is top notch.",
      source: "Google",
      createdAt: "2026-03-14",
    },
    {
      reviewerName: "Laura B.",
      rating: 5,
      comment: "Already had insurance so PlushCare made the most sense for me. They helped me navigate what was covered and how to get the most out of my plan. Saved a significant amount compared to other platforms.",
      source: "Trustpilot",
      createdAt: "2025-12-20",
    },
    {
      reviewerName: "Steven P.",
      rating: 4,
      comment: "Great for getting a prescription sorted. I used their pharmacy price comparison tool to find the best deal and ended up saving a lot. The telehealth visit was smooth and the doctor was knowledgeable.",
      source: "Google",
      createdAt: "2026-01-22",
    },
    {
      reviewerName: "Monica R.",
      rating: 3,
      comment: "Good doctors but if you're not covered by insurance, medication costs through pharmacies can vary a lot. Make sure you know what the medication will cost before committing. The consult itself is worth it though.",
      source: "Trustpilot",
      createdAt: "2026-02-08",
    },
  ],

  "calibrate": [
    {
      reviewerName: "Diana W.",
      rating: 5,
      comment: "The year-long coaching program genuinely changed my relationship with food. This isn't just a prescription service — the curriculum-based approach, dietitian check-ins, and structured behavioural support made this feel like real treatment. Down 48 lbs.",
      source: "Trustpilot",
      createdAt: "2026-05-10",
    },
    {
      reviewerName: "Peter C.",
      rating: 4,
      comment: "Expensive, no doubt about it. But the dietitian check-ins and the structured programme are worth it if you're serious about long-term change. This isn't for people who just want a quick fix.",
      source: "Google",
      createdAt: "2026-03-01",
    },
    {
      reviewerName: "Susan M.",
      rating: 5,
      comment: "Lost 45 lbs over 11 months with their full programme. The year-long structure kept me accountable in a way shorter programmes never did. I now have tools to maintain my weight without medication long-term. Genuinely life-changing.",
      source: "Trustpilot",
      createdAt: "2025-11-28",
    },
    {
      reviewerName: "Alex V.",
      rating: 3,
      comment: "Great programme but the price is hard to justify for many people. If you're comparing on cost alone, there are much cheaper options. If you want the full coaching and curriculum experience, this is the best out there.",
      source: "Google",
      createdAt: "2025-10-12",
    },
    {
      reviewerName: "Karen D.",
      rating: 4,
      comment: "Switched from a cheaper medication-only platform after 3 months with no real progress. The structured curriculum at Calibrate made a real difference within the first 8 weeks. The 1-year commitment sounds daunting but it works.",
      source: "Trustpilot",
      createdAt: "2026-01-15",
    },
  ],

  "found": [
    {
      reviewerName: "Julia N.",
      rating: 5,
      comment: "The community feature is genuinely helpful — being able to connect with others going through the same journey makes a big difference. Coaching is included and my coach has been excellent. Medication arrived in 5 days.",
      source: "Trustpilot",
      createdAt: "2026-04-18",
    },
    {
      reviewerName: "Michael S.",
      rating: 4,
      comment: "The $159 intro month is a fair way to try it out. The coaching and community are a real differentiator compared to medication-only platforms. After the first month the price goes up, so budget for that.",
      source: "Google",
      createdAt: "2026-02-25",
    },
    {
      reviewerName: "Rachel E.",
      rating: 4,
      comment: "Fast delivery — 5 days from approval to medication at my door. The Found app is well designed and the check-ins with my coach are quick but useful. Good balance of support and flexibility.",
      source: "Trustpilot",
      createdAt: "2025-12-05",
    },
    {
      reviewerName: "Gary B.",
      rating: 3,
      comment: "The intro month pricing is good but the ongoing cost jumps to $299 which felt steep for what's included. The coaching is helpful but I wasn't sure the value justified the price increase. Good platform, just watch the costs.",
      source: "Google",
      createdAt: "2026-01-10",
    },
    {
      reviewerName: "Patricia H.",
      rating: 5,
      comment: "The coaching and medication combo is exactly what I needed after years of trying to lose weight on my own. My coach keeps me accountable without being pushy and the compounded semaglutide has been very effective.",
      source: "Trustpilot",
      createdAt: "2026-03-30",
    },
  ],

  "sequence": [
    {
      reviewerName: "Thomas A.",
      rating: 5,
      comment: "An actual obesity medicine specialist reviewed my case — not just a GP. The level of care here is noticeably higher than other platforms I've tried. They understood the complexity of my medical history and personalised the treatment accordingly.",
      source: "Trustpilot",
      createdAt: "2026-05-05",
    },
    {
      reviewerName: "Melissa K.",
      rating: 4,
      comment: "The insurance navigation support saved me a significant amount of money. They helped me figure out what was covered and how to appeal. Worth the membership fee just for that alone. The physician care is excellent too.",
      source: "Google",
      createdAt: "2026-04-02",
    },
    {
      reviewerName: "Daniel F.",
      rating: 4,
      comment: "The WW integration adds real structure if you're already familiar with that approach. Having both physician oversight and behavioural tools in one programme is a compelling combination. More expensive than budget options but quality shows.",
      source: "Trustpilot",
      createdAt: "2025-11-10",
    },
    {
      reviewerName: "Anna C.",
      rating: 3,
      comment: "The physician quality is noticeably higher than other telehealth platforms, but so is the price. If you want specialist-level obesity medicine care it's worth it. If you just need a prescription and aren't fussed about oversight, go elsewhere.",
      source: "Google",
      createdAt: "2026-02-14",
    },
    {
      reviewerName: "James R.",
      rating: 5,
      comment: "Best GLP-1 provider I've tried after going through three others. The board-certified obesity medicine doctor made all the difference — they actually understood what I needed and adjusted the plan as I progressed. Down 35 lbs in 7 months.",
      source: "Trustpilot",
      createdAt: "2026-01-28",
    },
  ],

};
