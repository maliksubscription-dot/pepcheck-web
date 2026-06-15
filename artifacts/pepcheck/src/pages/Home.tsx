import { Link, useLocation } from "wouter";
import { Search, Pill, Activity, ShieldCheck, ArrowRight, Star, TrendingDown, MapPin, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListFeaturedProviders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo } from "react";

const HERO_CARDS = {
  default: [
    { name: "Hims & Hers", med: "Semaglutide", priceLabel: "Membership $39 first month", note: "then $149/mo · Medication separate" },
    { name: "Ro Body", med: "Semaglutide", priceLabel: "From $149/mo", note: "Medication included" },
    { name: "Calibrate", med: "Tirzepatide + Semaglutide", priceLabel: "From $299/mo", note: "Coaching + medication included" },
  ],
  tirzepatide: [
    { name: "LifeMD", med: "Tirzepatide", priceLabel: "From $75", note: "Medication separate" },
    { name: "Calibrate", med: "Tirzepatide", priceLabel: "From $299/mo", note: "Medication included" },
    { name: "Sequence", med: "Tirzepatide", priceLabel: "From $299/mo", note: "Physician-led · Medication included" },
  ],
  semaglutide: [
    { name: "Ro Body", med: "Semaglutide", priceLabel: "From $149/mo", note: "Medication included" },
    { name: "Henry Meds", med: "Semaglutide", priceLabel: "From $149/mo", note: "Medication included" },
    { name: "Hims & Hers", med: "Semaglutide", priceLabel: "Membership $39 first month", note: "then $149/mo · Medication separate" },
  ],
  both: [
    { name: "LifeMD", med: "Tirzepatide + Semaglutide", priceLabel: "From $75", note: "Medication separate" },
    { name: "Calibrate", med: "Tirzepatide + Semaglutide", priceLabel: "From $299/mo", note: "Medication included" },
    { name: "Sequence", med: "Tirzepatide + Semaglutide", priceLabel: "From $299/mo", note: "Physician-led" },
  ],
};

const TRUST_ITEMS = [
  "Texas availability checked",
  "Pricing reviewed regularly",
  "No medical advice provided",
  "Information updated monthly",
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedMed, setSelectedMed] = useState("");

  const { data: featuredProviders, isLoading: isFeaturedLoading } = useListFeaturedProviders();

  useEffect(() => {
    const w = "https://tally.so/widgets/embed.js";
    const load = () => {
      if (typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((el: Element) => {
          (el as HTMLIFrameElement).src = (el as HTMLIFrameElement).dataset.tallySrc!;
        });
      }
    };
    if (typeof (window as any).Tally !== "undefined") {
      load();
    } else if (!document.querySelector(`script[src="${w}"]`)) {
      const s = document.createElement("script");
      s.src = w;
      s.onload = load;
      s.onerror = load;
      document.body.appendChild(s);
    }
  }, []);

  const heroCards = useMemo(() => {
    return HERO_CARDS[selectedMed as keyof typeof HERO_CARDS] || HERO_CARDS.default;
  }, [selectedMed]);

  const handleMedChange = (val: string) => {
    console.log("Medication filter selected:", val || "all");
    setSelectedMed(val);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Compare Texas Providers clicked, medication:", selectedMed || "all");
    const params = new URLSearchParams();
    params.set("state", "TX");
    if (selectedMed && selectedMed !== "all") params.set("medication", selectedMed);
    params.set("sort", "price_asc");
    setLocation(`/compare?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-16 pb-20 md:pt-24 md:pb-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full w-fit text-sm font-medium border border-primary-foreground/20">
                <ShieldCheck className="w-4 h-4" />
                Texas Beta • Provider information checked regularly
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Compare GLP-1 Providers Available in Texas
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/80 max-w-md">
                Compare real monthly costs, medication options, consultation fees, shipping costs, and provider details before choosing a GLP-1 weight-loss program in Texas.
              </p>

              <form onSubmit={handleSearch} className="bg-background rounded-xl shadow-xl p-4 flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2 px-1 pb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Showing providers available in <span className="text-primary">Texas</span></span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Choose a medication to compare providers available in Texas.
                  </label>
                  <Select value={selectedMed} onValueChange={handleMedChange}>
                    <SelectTrigger className="bg-muted/30 border-border text-foreground" data-testid="select-medication">
                      <SelectValue placeholder="All medications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tirzepatide">Tirzepatide (Mounjaro / Zepbound)</SelectItem>
                      <SelectItem value="semaglutide">Semaglutide (Ozempic / Wegovy)</SelectItem>
                      <SelectItem value="both">Both (Tirzepatide & Semaglutide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="w-full font-bold text-base" data-testid="button-compare">
                  Compare Texas Providers <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="grid grid-cols-2 gap-1 pt-1 border-t">
                  {TRUST_ITEMS.map(item => (
                    <span key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-600 shrink-0" /> {item}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground text-center border-t pt-2 leading-relaxed">
                  Pepcheck does not sell medication or provide medical advice. Information should always be verified directly with the provider.
                </p>
              </form>
            </div>

            {/* Hero preview cards */}
            <div className="hidden md:block">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary-foreground/5 rounded-[2rem] transform rotate-6 border border-primary-foreground/10" />
                <div className="absolute inset-0 bg-primary-foreground/10 rounded-[2rem] transform -rotate-2 border border-primary-foreground/20" />
                <div className="relative bg-primary-foreground/10 rounded-[2rem] border border-primary-foreground/20 p-6 space-y-3">
                  {heroCards.map((p, i) => (
                    <div key={i} className="bg-background rounded-xl p-4 shadow-lg flex items-center justify-between text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.med}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-primary leading-tight">{p.priceLabel}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{p.note}</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-xs text-primary-foreground/60 pt-2">
                    + 5 more Texas providers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats — static for Texas beta */}
      <section className="py-10 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: "8", label: "Providers Compared" },
              { val: "1", label: "State Covered" },
              { val: "Jun 2026", label: "Last Updated" },
              { val: "100%", label: "Texas Focused" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <div className="text-3xl font-black text-primary">{val}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">Find your provider in 30 seconds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, step: "1", title: "Select your medication", desc: "Tell us which GLP-1 medication you're looking for. We filter out providers that don't offer it in Texas." },
              { icon: TrendingDown, step: "2", title: "Compare costs side by side", desc: "See first-month cost, ongoing fees, consultation, shipping, delivery time, and price transparency at a glance." },
              { icon: Star, step: "3", title: "Click through to your provider", desc: "Read full provider profiles and click directly to the provider's site. Information should be verified with the provider." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-md relative">
                  <Icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border-2 border-primary text-primary text-[10px] font-black flex items-center justify-center">{step}</span>
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/compare?state=TX&sort=price_asc">Compare Texas Providers <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section id="signup" className="py-12 px-4 border-t">
        <div style={{maxWidth: "520px", margin: "0 auto", padding: "0 1rem", position: "relative"}}>
          <iframe
            data-tally-src="https://tally.so/embed/J9BGxo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height={586}
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Pepcheck"
          />
          {/* Cover Tally branding element injected at bottom-right of form */}
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "55%",
            height: "56px",
            background: "white",
            zIndex: 10,
            pointerEvents: "none",
          }} />
        </div>
      </section>

      {/* Featured Providers */}
      <section id="learn-section" className="py-16 px-4 bg-muted/20 border-t learn-target">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Providers</h2>
              <p className="text-muted-foreground text-sm mt-1">Telehealth providers offering GLP-1 medications available in Texas. Details reviewed regularly.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/compare?state=TX&sort=price_asc">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {isFeaturedLoading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)
              : featuredProviders?.map((provider) => (
                <Link key={provider.id} href={`/providers/${provider.id}`}>
                  <Card className="h-full overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                    <div className="p-5 border-b bg-muted/10 flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-background border flex items-center justify-center overflow-hidden">
                        {provider.logoUrl
                          ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                          : <div className="font-bold text-lg text-primary">{provider.name.charAt(0)}</div>
                        }
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {provider.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Information checked
                          </span>
                        )}
                        {provider.freeShipping && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                            <Package className="w-3 h-3" /> Free Shipping
                          </span>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-1">{provider.name}</h3>
                      <div className="flex items-center gap-1.5 mb-3 text-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="font-semibold">{provider.rating?.toFixed(1) || "N/A"}</span>
                        <span className="text-muted-foreground">({provider.reviewCount})</span>
                        {provider.avgDeliveryDays && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{provider.avgDeliveryDays}d delivery</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {provider.firstMonthCost != null
                            ? <>From <span className="text-xl font-black text-primary">${provider.firstMonthCost}</span> <span className="text-muted-foreground text-xs">first month</span></>
                            : <span className="text-muted-foreground text-sm">Price varies</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">Available in TX</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 px-4 border-t">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-3">Why use Pepcheck?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
            Pepcheck independently researches GLP-1 telehealth providers and compiles pricing, availability, and program details in one place. We do not sell medication or provide medical advice.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: "Pricing Reviewed", desc: "Prices confirmed from provider sites and updated regularly" },
              { icon: Search, label: "Texas Availability", desc: "Provider availability in Texas checked on an ongoing basis" },
              { icon: Package, label: "Program Details", desc: "Medication type, consultation, and shipping details reviewed" },
              { icon: Activity, label: "Regularly Updated", desc: "Information refreshed when provider changes are detected" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
