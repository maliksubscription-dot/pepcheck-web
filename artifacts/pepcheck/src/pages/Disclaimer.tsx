import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Disclaimer() {
  return (
    <div className="w-full">
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-7 h-7" />
            <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Important information about the nature and limitations of data presented on Pepcheck.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-10 text-muted-foreground leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Not Medical Advice</h2>
            <p>
              Pepcheck is a medication comparison platform, not a healthcare provider. The information on this website — including pricing data, medication descriptions, and state availability — is provided for informational purposes only. Nothing on Pepcheck constitutes medical advice, diagnosis, or treatment recommendations.
            </p>
            <p className="mt-3">
              Always consult with a licensed healthcare professional before starting, stopping, or changing any medication. Your doctor or prescriber is the appropriate resource for medical guidance.
            </p>
          </div>

          <div className="border-t pt-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Accuracy of Pricing Data</h2>
            <p>
              Pepcheck makes reasonable efforts to maintain accurate and up-to-date pricing information. However, provider pricing can change without notice. Prices shown on Pepcheck may not reflect current provider pricing at the time you visit a provider's website.
            </p>
            <p className="mt-3">
              Always verify pricing directly with a provider before making a purchase decision. Pepcheck is not responsible for discrepancies between listed prices and prices charged by providers.
            </p>
          </div>

          <div className="border-t pt-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Legal Status Information</h2>
            <p>
              State-level legality and availability information is based on our research of applicable pharmacy board regulations, telemedicine prescribing laws, and FDA guidance. This information is subject to change — sometimes rapidly — and may not reflect the most current regulatory status.
            </p>
            <p className="mt-3">
              Pepcheck does not provide legal advice. Do not rely on Pepcheck's legality classifications as a definitive determination of what is permissible in your jurisdiction. Consult your provider or a licensed attorney for legal guidance.
            </p>
          </div>

          <div className="border-t pt-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Provider Relationships</h2>
            <p>
              Some providers on Pepcheck pay for featured placement. Featured providers are clearly labeled with a "Featured" badge. Payment for featured placement does not influence editorial ratings, review scores, or legality assessments.
            </p>
            <p className="mt-3">
              Pepcheck does not earn commissions or referral fees from provider visits. We do not have financial relationships with any compounding pharmacies.
            </p>
          </div>

          <div className="border-t pt-10">
            <h2 className="text-xl font-bold text-foreground mb-3">No Warranties</h2>
            <p>
              Pepcheck provides data "as is" without warranty of any kind, express or implied. We do not warrant the accuracy, completeness, or fitness for a particular purpose of any information on this site.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, Pepcheck disclaims all liability for any damages arising from reliance on information presented on this website.
            </p>
          </div>

          <div className="border-t pt-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Contact</h2>
            <p>
              If you believe any information on Pepcheck is inaccurate, out of date, or misleading, please contact us. We take data accuracy seriously and will investigate and correct verified errors promptly.
            </p>
          </div>

          <div className="border-t pt-10 text-sm text-muted-foreground/60">
            <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>

          <div className="flex gap-3">
            <Button asChild><Link href="/compare">Compare Providers</Link></Button>
            <Button asChild variant="outline"><Link href="/methodology">Our Methodology</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
