import { Link } from "wouter";
import { CheckCircle, ShieldCheck, ArrowRight, Calendar, DollarSign, MapPin, Package, Pill, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CHECKS = [
  { icon: DollarSign, label: "Public pricing", desc: "We check that prices are publicly listed and note when they are not." },
  { icon: MapPin, label: "Texas availability", desc: "We verify each provider is actively accepting patients in Texas." },
  { icon: Package, label: "Consultation fees", desc: "We record whether consultation is included or charged separately." },
  { icon: Truck, label: "Shipping costs", desc: "We document shipping fees and note which providers offer free shipping." },
  { icon: Pill, label: "Medication options", desc: "We list which GLP-1 medications (tirzepatide, semaglutide) each provider offers." },
  { icon: Calendar, label: "Last verified date", desc: "Every provider profile shows when we last reviewed their information." },
];

export default function HowWeVerify() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-14 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-foreground/20 mb-5">
            <ShieldCheck className="w-4 h-4" />
            Texas Beta
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">How We Verify Providers</h1>
          <p className="text-primary-foreground/75 text-base max-w-xl">
            Pepcheck independently researches each GLP-1 telehealth provider listed on the site. Here's exactly what we check and how we keep information current.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border-b border-amber-200 py-4 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Important:</span> Pepcheck does not sell medication, prescribe medication, or provide medical advice. Information is for comparison purposes only and should always be verified directly with the provider before making a healthcare decision.
          </p>
        </div>
      </section>

      {/* What We Check */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">What We Check</h2>
          <p className="text-muted-foreground text-sm mb-8">
            For every provider listed on Pepcheck, we review the following information directly from their public website and official communications.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {CHECKS.map(({ icon: Icon, label, desc }) => (
              <Card key={label} className="border hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span className="font-semibold text-sm">{label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How often */}
      <section className="py-12 px-4 bg-muted/20 border-t border-b">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">How Often We Update</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Provider information is reviewed on an ongoing basis. Each provider profile displays a <span className="font-semibold text-foreground">Last Verified</span> date so you can see exactly when we last checked their details.
            </p>
            <p>
              We prioritise keeping pricing, Texas availability, and medication offerings up to date. If you notice something that looks out of date, please contact us so we can re-check.
            </p>
            <p>
              Pepcheck is currently in <span className="font-semibold text-foreground">Texas Beta</span>. We're focused on getting the Texas market right before expanding to other states.
            </p>
          </div>
        </div>
      </section>

      {/* What we don't do */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">What Pepcheck Does Not Do</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Sell or dispense medication of any kind",
              "Prescribe or recommend specific medications or providers",
              "Provide medical, clinical, or healthcare advice",
              "Guarantee the accuracy of third-party provider pricing",
              "Accept payment from providers in exchange for rankings or placement",
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-muted/30 rounded-xl border text-xs text-muted-foreground leading-relaxed">
            Always consult a licensed medical professional before starting any GLP-1 medication programme. Provider prices, availability, and offerings change frequently — verify everything directly with the provider before making any decision.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Compare Texas Providers?</h2>
          <p className="text-primary-foreground/75 text-sm mb-6">
            See pricing, medications, and availability for all 8 providers currently listed in Texas.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href="/compare?state=TX&sort=price_asc">
              Compare Texas Providers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
