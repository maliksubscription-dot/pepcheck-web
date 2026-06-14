import { useListProviders, useGetMedicationPriceRange, useTrackProviderClick } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { ShieldCheck, Star, ArrowRight, TrendingDown, DollarSign, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function CheapestTirzepatide() {
  const [, setLocation] = useLocation();
  const [stateFilter, setStateFilter] = useState("");

  const { data: providers, isLoading } = useListProviders({
    medication: "tirzepatide",
    sort: "price_asc",
    ...(stateFilter ? { state: stateFilter } : {}),
  });

  const { data: priceRange } = useGetMedicationPriceRange({ medication: "tirzepatide" });
  const trackClick = useTrackProviderClick();

  const handleVisit = (providerId: number, website?: string | null) => {
    trackClick.mutate({ data: { providerId, source: "cheapest-tirzepatide" } });
    if (website) window.open(website, "_blank", "noopener noreferrer");
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-4">
            <TrendingDown className="w-5 h-5" /> Price Comparison
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            Cheapest Compounded Tirzepatide Providers
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
            Side-by-side pricing for compounded tirzepatide from every vetted telehealth provider. Sorted by lowest price. Updated regularly.
          </p>

          {priceRange && (
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
                <div className="text-2xl font-black">${Math.round(priceRange.minPrice)}</div>
                <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Lowest Price</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
                <div className="text-2xl font-black">${Math.round(priceRange.avgPrice)}</div>
                <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Avg Price</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-4 text-center border border-primary-foreground/20">
                <div className="text-2xl font-black">{priceRange.providerCount}</div>
                <div className="text-xs text-primary-foreground/70 mt-1 uppercase tracking-wider">Providers</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="container mx-auto max-w-5xl flex items-center gap-2 text-sm text-blue-800">
          <Info className="w-4 h-4 shrink-0" />
          <p>Prices are per vial and may vary by concentration and vial size. Some providers bundle consultation fees separately. All prices are self-pay.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold">Tirzepatide Pricing Table</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {providers?.length || 0} providers · sorted lowest price first
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                data-testid="select-state-filter"
              >
                <option value="">All States</option>
                {["CA","TX","FL","NY","IL","PA","OH","GA","NC","MI","NJ","VA","WA","AZ","MA","TN","IN","CO","MN","OR","UT","NV"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[700px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left text-sm font-semibold p-4">Provider</th>
                  <th className="text-left text-sm font-semibold p-4">Starting Price</th>
                  <th className="text-left text-sm font-semibold p-4">Rating</th>
                  <th className="text-left text-sm font-semibold p-4">States Served</th>
                  <th className="text-right text-sm font-semibold p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array(6).fill(0).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4"><Skeleton className="h-6 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                    </tr>
                  ))
                  : providers?.map((provider, i) => (
                    <tr key={provider.id} className={`border-b hover:bg-muted/20 transition-colors ${i === 0 ? "bg-green-50/50" : ""}`} data-testid={`row-provider-${provider.id}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {i === 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded shrink-0">
                              LOWEST
                            </span>
                          )}
                          <div className="w-8 h-8 rounded-lg bg-secondary border flex items-center justify-center shrink-0">
                            <span className="font-bold text-xs text-primary">{provider.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-1.5">
                              {provider.name}
                              {provider.verified && <ShieldCheck className="w-3.5 h-3.5 text-green-600" />}
                            </div>
                            {provider.featured && <Badge variant="secondary" className="text-xs mt-0.5">Featured</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-2xl font-black text-primary">${provider.minPrice}</span>
                        <span className="text-muted-foreground text-xs ml-1">/vial</span>
                      </td>
                      <td className="p-4">
                        {provider.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-sm">{provider.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({provider.reviewCount})</span>
                          </div>
                        ) : <span className="text-muted-foreground text-sm">N/A</span>}
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{provider.statesAvailable} states</span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/providers/${provider.id}`}>Details</Link>
                          </Button>
                          {provider.website && (
                            <Button size="sm" onClick={() => handleVisit(provider.id, provider.website)} data-testid={`button-visit-${provider.id}`}>
                              Visit <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/compare?medication=tirzepatide">
                <DollarSign className="w-4 h-4 mr-2" /> Advanced Filter & Compare
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-muted/30 border-t px-4">
        <div className="container mx-auto max-w-3xl space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground">About Compounded Tirzepatide Pricing</h2>
          <p>
            Compounded tirzepatide is a pharmacy-prepared version of tirzepatide (the active ingredient in brand-name Mounjaro and Zepbound). It became widely available during the FDA shortage of brand-name products. Compounded versions are typically 60–80% cheaper than brand-name tirzepatide.
          </p>
          <p>
            Prices vary based on the compounding pharmacy, vial concentration (measured in mg/mL), vial size (measured in mL), and whether consultation fees are bundled. Most providers on Pepcheck charge between $199 and $625 per vial for compounded tirzepatide.
          </p>
          <p>
            <strong className="text-foreground">Important:</strong> The FDA shortage designation for tirzepatide may change, which could affect the availability of compounded alternatives. Always confirm current availability with your provider.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild><Link href="/compare?medication=tirzepatide&sort=price_asc">Compare All Options</Link></Button>
            <Button asChild variant="outline"><Link href="/medications">Medications Guide</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
