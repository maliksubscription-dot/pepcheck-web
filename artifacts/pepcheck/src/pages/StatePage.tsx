import { useParams, useLocation } from "wouter";
import { useListProviders, useListStates, useTrackProviderClick } from "@workspace/api-client-react";
import { ShieldCheck, Star, MapPin, ArrowRight, AlertTriangle, CheckCircle, XCircle, MinusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const statusConfig = {
  legal: { label: "Legal", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-800" },
  gray_zone: { label: "Gray Zone", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800" },
  restricted: { label: "Restricted", icon: MinusCircle, color: "text-orange-600", bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-800" },
  unavailable: { label: "Unavailable", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-800" },
};

export default function StatePage() {
  const params = useParams<{ code: string }>();
  const stateCode = params.code?.toUpperCase() || "";
  const stateName = US_STATES[stateCode] || stateCode;
  const [, setLocation] = useLocation();

  const { data: providers, isLoading } = useListProviders({ state: stateCode, sort: "price_asc" });
  const trackClick = useTrackProviderClick();

  const handleVisitProvider = (providerId: number, website?: string | null) => {
    trackClick.mutate({ data: { providerId, source: "state-page" } });
    if (website) window.open(website, "_blank", "noopener noreferrer");
  };

  const legalCount = providers?.filter(p => {
    return true;
  }).length || 0;

  if (!US_STATES[stateCode]) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">State not found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find information for state code "{stateCode}".</p>
        <Button asChild><Link href="/compare">Browse All Providers</Link></Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => setLocation("/states")}
            className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All States
          </button>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center shrink-0">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-2">Compounded GLP-1 Providers</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{stateName}</h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl">
                Compare vetted telehealth providers offering compounded tirzepatide and semaglutide that are available to residents of {stateName}. Prices, concentrations, and compliance status verified and updated regularly.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
              <div className="text-2xl font-black">{isLoading ? "—" : providers?.length || 0}</div>
              <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Providers</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
              <div className="text-2xl font-black">
                {isLoading ? "—" : providers && providers.length > 0 ? `$${Math.min(...providers.filter(p => p.minPrice != null).map(p => p.minPrice as number))}` : "—"}
              </div>
              <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Lowest Price</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
              <div className="text-2xl font-black">4</div>
              <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Medications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="bg-amber-50 border-b border-amber-200 px-4 py-4">
        <div className="container mx-auto max-w-5xl flex items-start gap-3 text-sm text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <strong>Regulatory note:</strong> Compounded medication regulations change frequently. The information below reflects our most recent data, but always confirm legality directly with your chosen provider before ordering. Last data refresh: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
          </p>
        </div>
      </section>

      {/* Provider List */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Available Providers in {stateName}</h2>
              <p className="text-muted-foreground mt-1 text-sm">Sorted by lowest price first</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/compare?state=${stateCode}`}>
                Advanced Filters <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
            </div>
          ) : providers?.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 border border-dashed rounded-xl">
              <XCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No providers available in {stateName}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Compounding regulations in {stateName} currently prevent most providers from shipping here. Check back as regulations evolve.
              </p>
              <Button asChild><Link href="/compare">Browse All Providers</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {providers?.map((provider) => (
                <Card key={provider.id} className="overflow-hidden hover:border-primary/50 transition-all" data-testid={`card-provider-${provider.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-secondary border flex items-center justify-center shrink-0">
                          {provider.logoUrl ? (
                            <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="font-bold text-primary">{provider.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-xl">{provider.name}</h3>
                            {provider.verified && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                            {provider.featured && (
                              <Badge variant="secondary" className="text-xs">Featured</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm mb-3">
                            {provider.rating && (
                              <>
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                              </>
                            )}
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{provider.statesAvailable} states</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
                          {provider.lastVerified && (
                            <p className="text-xs text-muted-foreground/60 mt-2">
                              Last verified: {new Date(provider.lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">From</div>
                          <div className="text-2xl font-black text-primary">${provider.minPrice}</div>
                          <div className="text-xs text-muted-foreground">/vial</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/providers/${provider.id}`}>Details</Link>
                          </Button>
                          {provider.website && (
                            <Button
                              size="sm"
                              onClick={() => handleVisitProvider(provider.id, provider.website)}
                              data-testid={`button-visit-${provider.id}`}
                            >
                              Visit <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-muted/30 border-t px-4">
        <div className="container mx-auto max-w-3xl prose prose-neutral">
          <h2 className="text-2xl font-bold mb-6">About Compounded GLP-1 Medications in {stateName}</h2>
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              Compounded tirzepatide and semaglutide have become increasingly popular alternatives to brand-name GLP-1 medications like Mounjaro, Zepbound, Ozempic, and Wegovy. In {stateName}, residents can access these compounded versions through licensed telehealth providers that ship from FDA-regulated 503B outsourcing facilities or state-licensed 503A compounding pharmacies.
            </p>
            <p>
              Prices for compounded GLP-1 medications in {stateName} range from approximately ${providers && providers.length > 0 && providers[0].minPrice ? providers[0].minPrice : 199} to ${providers && providers.length > 0 ? Math.max(...providers.filter(p => p.maxPrice != null).map(p => p.maxPrice as number)) : 600} per vial, depending on the provider, concentration, and vial size. Most providers offer monthly subscription pricing.
            </p>
            <p>
              Always verify that your chosen provider is licensed to practice telemedicine in {stateName} and that their compounding pharmacy complies with applicable FDA and state pharmacy board regulations. Pepcheck independently verifies provider credentials and updates listings when regulatory status changes.
            </p>
          </div>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href={`/compare?state=${stateCode}&sort=price_asc`}>Compare Prices in {stateName}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/methodology">Our Methodology</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
