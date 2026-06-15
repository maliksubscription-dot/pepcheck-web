import { Link, useLocation } from "wouter";
import { Search, Pill, Activity, ShieldCheck, ArrowRight, Star, TrendingDown, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetPlatformStats, useListFeaturedProviders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedState, setSelectedState] = useState("");
  const [selectedMed, setSelectedMed] = useState("");

  const { data: stats, isLoading: isStatsLoading } = useGetPlatformStats();
  const { data: featuredProviders, isLoading: isFeaturedLoading } = useListFeaturedProviders();

  useEffect(() => {
    if (typeof (window as any).Tally !== "undefined") {
      (window as any).Tally.loadEmbeds();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedState) params.set("state", selectedState);
    if (selectedMed && selectedMed !== "both") params.set("medication", selectedMed);
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
                Vetted Providers Only
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Find the cheapest verified GLP-1 provider in your state
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/80 max-w-md">
                Compare prices, medication options, state availability, shipping, consultation fees, and verification status before choosing a provider.
              </p>

              <form onSubmit={handleSearch} className="bg-background rounded-xl shadow-xl p-4 flex flex-col gap-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">State</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="bg-muted/30 border-border text-foreground" data-testid="select-state">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(([code, name]) => (
                          <SelectItem key={code} value={code}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Medication</label>
                    <Select value={selectedMed} onValueChange={setSelectedMed}>
                      <SelectTrigger className="bg-muted/30 border-border text-foreground" data-testid="select-medication">
                        <SelectValue placeholder="All medications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both (Tirzepatide & Semaglutide)</SelectItem>
                        <SelectItem value="tirzepatide">Tirzepatide (Mounjaro / Zepbound)</SelectItem>
                        <SelectItem value="semaglutide">Semaglutide (Ozempic / Wegovy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full font-bold text-base" data-testid="button-compare">
                  Compare Providers <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="flex flex-wrap gap-3 text-xs text-primary-foreground/70">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 100% free to use</span>
                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> No signup required</span>
                <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Prices updated regularly</span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden md:block">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary-foreground/5 rounded-[2rem] transform rotate-6 border border-primary-foreground/10" />
                <div className="absolute inset-0 bg-primary-foreground/10 rounded-[2rem] transform -rotate-2 border border-primary-foreground/20" />
                <div className="relative bg-primary-foreground/10 rounded-[2rem] border border-primary-foreground/20 p-6 space-y-3">
                  {[
                    { name: "Hims & Hers", med: "Tirzepatide", price: "$249", badge: "LOWEST" },
                    { name: "Henry Meds", med: "Tirzepatide", price: "$299", badge: null },
                    { name: "Ro Body", med: "Semaglutide", price: "$199", badge: null },
                  ].map((p, i) => (
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
                      <div className="flex items-center gap-2">
                        {p.badge && (
                          <span className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">{p.badge}</span>
                        )}
                        <div className="font-black text-primary">{p.price}/mo</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-xs text-primary-foreground/60 pt-2">
                    + {(stats?.totalProviders || 12) - 3} more providers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-10 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: isStatsLoading ? null : stats?.verifiedProviders, label: "Vetted Providers" },
              { val: isStatsLoading ? null : stats?.statesCovered, label: "States Covered" },
              { val: isStatsLoading ? null : `$${Math.round(stats?.avgPricePerVial || 0)}`, label: "Avg Price/Vial" },
              { val: isStatsLoading ? null : stats?.totalReviews, label: "Patient Reviews" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                {val === null ? (
                  <Skeleton className="h-9 w-20 mb-1" />
                ) : (
                  <div className="text-3xl font-black text-primary">{val}</div>
                )}
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
              { icon: MapPin, step: "1", title: "Select your state & medication", desc: "Tell us where you live and which GLP-1 medication you need. We filter out providers that can't legally ship to you." },
              { icon: TrendingDown, step: "2", title: "Compare prices side by side", desc: "See starting price, shipping, consultation fees, delivery time, and verification status at a glance." },
              { icon: Star, step: "3", title: "Click through to your provider", desc: "Read full provider profiles, patient reviews, and click directly to the provider's site to get started." },
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
              <Link href="/compare">Start Comparing <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-12 px-4 border-t">
        <div style={{maxWidth: "520px", margin: "0 auto", padding: "0 1rem"}}>
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
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 px-4 bg-muted/20 border-t">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Providers</h2>
              <p className="text-muted-foreground text-sm mt-1">Independently verified telehealth providers offering compounded GLP-1 medications.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/compare">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
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
                            <ShieldCheck className="w-3 h-3" /> Verified
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
                          From <span className="text-xl font-black text-primary">${provider.minPrice}</span>
                          <span className="text-muted-foreground text-xs">/vial</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{provider.statesAvailable} states</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           TALLY.SO EMAIL SIGNUP FORM
           Collects email + medication interest from homepage visitors.

           TO ACTIVATE: Replace YOUR_TALLY_FORM_ID in the src URL below
           with your real Tally form ID.
           Find it in: tally.so → your form → Share → Embed → the ID
           in the URL (e.g. https://tally.so/embed/wA1bc2 → ID is wA1bc2)
           ============================================================ */}
      <section className="py-16 px-4 bg-primary/5 border-t border-b">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              Free Price Alerts
            </span>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Get notified when prices drop
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              We monitor all 12 providers and send you an email when pricing changes in your state. No spam — one email per meaningful change.
            </p>
          </div>
          {/* Tally embed — replace YOUR_TALLY_FORM_ID with your real form ID */}
          <div className="rounded-2xl overflow-hidden border bg-background shadow-sm">
            <iframe
              data-tally-src="https://tally.so/embed/YOUR_TALLY_FORM_ID?alignLeft=0&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="220"
              frameBorder={0}
              title="GLP-1 price alert signup"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            We never sell or share your email. Unsubscribe any time.
          </p>
        </div>
      </section>
      {/* Tally embed loader — initialises dynamic height resizing */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof Tally === 'undefined') {
              var s = document.createElement('script');
              s.src = 'https://tally.so/widgets/embed.js';
              s.async = true;
              s.onload = function() { if (typeof Tally !== 'undefined') Tally.loadEmbeds(); };
              document.head.appendChild(s);
            } else {
              Tally.loadEmbeds();
            }
          `
        }}
      />

      {/* Trust section */}
      <section className="py-16 px-4 border-t">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-3">Why trust Pepcheck?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-sm">Every provider on Pepcheck is independently researched before listing. We verify licensing, compounding pharmacy credentials, and pricing accuracy on an ongoing basis.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: "Price Verified", desc: "Prices confirmed directly from provider sites" },
              { icon: Search, label: "State Availability", desc: "Shipping legality checked per state" },
              { icon: Package, label: "Pharmacy Vetted", desc: "Compounding pharmacy credentials reviewed" },
              { icon: Activity, label: "Regularly Updated", desc: "Data refreshed when changes are detected" },
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
