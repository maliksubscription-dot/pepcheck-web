import { Link } from "wouter";
import { ShieldCheck, Eye, RefreshCw, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Pepcheck</h1>
          <p className="text-primary-foreground/80 text-xl max-w-2xl leading-relaxed">
            We built Pepcheck because navigating the compounded GLP-1 market was — and still is — unnecessarily hard. Patients deserve clear information, not a maze of Reddit threads and outdated pharmacy listings.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Why we built this</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The compounded GLP-1 market exploded when demand for tirzepatide and semaglutide outpaced brand-name supply. Hundreds of telehealth providers entered the market — some legitimate, many operating in legal gray zones, and a few that were outright dangerous.
                </p>
                <p>
                  Prices ranged from $200 to $600 for the exact same medication and concentration, with no clear reason why. Patients pieced together information from Reddit, YouTube, and word-of-mouth, often making decisions based on incomplete or outdated data.
                </p>
                <p>
                  Pepcheck fixes that. We independently research every provider, track pricing changes, monitor state-level regulatory updates, and publish the results in one place — for free.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: ShieldCheck, title: "Vetted Providers Only", desc: "Every provider on Pepcheck has been reviewed for licensing, compounding pharmacy credentials, and operational legitimacy. We don't list providers we wouldn't recommend to a family member." },
                { icon: Eye, title: "Full Transparency", desc: "We show pricing, vial concentrations, consultation fees, and state availability — no paywalls, no signup required, no hidden data." },
                { icon: RefreshCw, title: "Regularly Updated", desc: "Regulations change. Prices change. We monitor provider listings and state pharmacy board guidance on an ongoing basis." },
                { icon: Users, title: "Patient-First", desc: "We exist to serve patients, not providers. Featured placements are clearly labeled. Editorial coverage is independent." },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-16 bg-muted/30 border-y px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">How Pepcheck is funded</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
            <div>
              <p className="mb-4">
                Pepcheck is free for patients. We're funded through featured placement fees paid by telehealth providers who want to be prominently featured on the platform.
              </p>
              <p>
                <strong className="text-foreground">Featured placements are always clearly labeled</strong> with a "Featured" badge. They do not affect our editorial review process — providers must still meet our verification standards to appear on Pepcheck at all.
              </p>
            </div>
            <div>
              <p className="mb-4">
                We do not accept payment to change ratings, reviews, or legality assessments. We do not sell patient data. We do not earn commissions on provider visits.
              </p>
              <p>
                Our goal is to become the most trusted comparison platform in the compounded medication space — and that trust depends entirely on our editorial independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">Start comparing</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Find the right GLP-1 provider for your state, budget, and medication preference.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/compare">Compare Providers <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/methodology">Our Methodology</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
