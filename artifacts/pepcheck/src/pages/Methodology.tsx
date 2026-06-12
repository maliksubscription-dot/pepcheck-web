import { Link } from "wouter";
import { CheckCircle, Clock, Search, Scale, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Methodology() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-4">
            <Scale className="w-5 h-5" /> Data & Standards
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Methodology</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            How we select, verify, and update provider listings — and how we determine legality status by state.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-neutral max-w-none space-y-12">

            {/* Provider Selection */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Provider Selection Criteria</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed pl-14">
                <p>Only providers that meet all of the following criteria are listed on Pepcheck:</p>
                <ul className="space-y-2">
                  {[
                    "Licensed to practice telemedicine in at least 10 US states",
                    "Dispenses medications from an FDA-registered 503B outsourcing facility or a state-licensed 503A compounding pharmacy",
                    "Employs US-licensed prescribers (MD, DO, NP, or PA)",
                    "Has a verifiable business address and customer support channel",
                    "Has not been subject to FDA warning letters or state pharmacy board sanctions",
                    "Publishes pricing clearly on their website or provided pricing to Pepcheck directly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing Data */}
            <div className="border-t pt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Pricing Data Collection</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed pl-14">
                <p>
                  Pricing data is collected by our team directly from provider websites and ordering pages. We record the per-vial price, vial concentration (mg/mL), vial size (mL), and stock status. Consultation fees, when charged separately, are noted.
                </p>
                <p>
                  Listings are reviewed and updated on a rolling basis. Providers are asked to notify us when prices change. We also monitor provider sites for price changes and update within 48 hours of detecting a discrepancy.
                </p>
                <p>
                  We do not estimate or extrapolate prices. If we cannot confirm a price, that listing is marked as unverified or removed until confirmed.
                </p>
              </div>
            </div>

            {/* Legality Status */}
            <div className="border-t pt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Legal Status Classification</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed pl-14">
                <p>We classify each provider's availability in each state using four statuses:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  {[
                    { status: "Legal", color: "bg-green-100 text-green-800", desc: "The provider is licensed to prescribe and ship this medication to this state. No known regulatory issues." },
                    { status: "Gray Zone", color: "bg-amber-100 text-amber-800", desc: "The provider serves this state, but regulations are in flux or there is pending guidance that may affect availability." },
                    { status: "Restricted", color: "bg-orange-100 text-orange-800", desc: "The provider cannot serve this state due to state-level pharmacy board or prescribing restrictions." },
                    { status: "Unavailable", color: "bg-red-100 text-red-800", desc: "The provider does not serve this state. This may be due to licensing, regulatory, or business reasons." },
                  ].map(({ status, color, desc }) => (
                    <div key={status} className="border rounded-xl p-4">
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded mb-2 ${color}`}>{status}</span>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Legal status is determined by reviewing state pharmacy board guidance, state telemedicine prescribing laws, and FDA shortage designation status. We consult primary sources wherever possible and note the date of our most recent review.
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t pt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Review Verification</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed pl-14">
                <p>
                  All reviews submitted through Pepcheck are reviewed by our team before publication. We verify that reviews are from real patients (not provider employees or bots) and that review content is relevant to the provider's GLP-1 services.
                </p>
                <p>
                  We do not edit review content. Reviews that contain personal health information, inappropriate language, or that we cannot verify are removed. Unverified reviews are not displayed publicly.
                </p>
              </div>
            </div>

            {/* Limitations */}
            <div className="border-t pt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold m-0">Known Limitations</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed pl-14">
                <p>
                  Despite our best efforts, our data may become outdated between update cycles. Regulatory changes in the compounded GLP-1 space happen frequently and sometimes without public notice.
                </p>
                <p>
                  We do not have financial relationships with any compounding pharmacies and cannot vouch for the quality of a specific batch of medication. We strongly encourage patients to research their chosen provider and pharmacy independently.
                </p>
                <p>
                  Pepcheck is a comparison platform, not a medical provider. Nothing on this site constitutes medical advice. Always consult with a licensed healthcare professional before starting any medication regimen.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t flex gap-3">
            <Button asChild>
              <Link href="/compare">Start Comparing <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">About Pepcheck</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
