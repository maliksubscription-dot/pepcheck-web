import { useListMedications, useGetMedicationPriceRange, useListProviders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { TrendingDown, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MedicationPriceCard({ slug, name, drugClass }: { slug: string; name: string; drugClass: string }) {
  const { data: range, isLoading } = useGetMedicationPriceRange(
    { medication: slug },
    { query: { queryKey: [slug, "price-range"] } }
  );
  const { data: providers } = useListProviders({ medication: slug, sort: "price_asc" });
  const cheapest = providers?.[0];

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all" data-testid={`card-medication-${slug}`}>
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">{drugClass}</p>
          </div>
          <span className="text-xs text-muted-foreground bg-background border px-2 py-1 rounded-md">
            Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : range ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Lowest</div>
                <div className="text-2xl font-black text-green-600">${Math.round(range.minPrice)}</div>
              </div>
              <div className="text-center border-x">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Average</div>
                <div className="text-2xl font-black text-primary">${Math.round(range.avgPrice)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Highest</div>
                <div className="text-2xl font-black text-foreground">${Math.round(range.maxPrice)}</div>
              </div>
            </div>

            {/* Visual price bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-primary rounded-full"
                style={{ width: "100%" }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-muted-foreground">{range.providerCount} providers offer {name}</div>
              {cheapest && (
                <div className="text-xs text-muted-foreground">
                  Cheapest: <span className="font-semibold text-foreground">{cheapest.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link href={`/compare?medication=${slug}&sort=price_asc`}>
                  Compare <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
              {slug === "tirzepatide" && (
                <Button size="sm" asChild className="flex-1">
                  <Link href="/cheapest-tirzepatide">Price Table</Link>
                </Button>
              )}
              {slug === "semaglutide" && (
                <Button size="sm" asChild className="flex-1">
                  <Link href="/cheapest-semaglutide">Price Table</Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No pricing data available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PriceTracker() {
  const { data: medications, isLoading } = useListMedications();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-4">
            <TrendingDown className="w-5 h-5" /> Market Prices
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            GLP-1 Price Tracker
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mb-6">
            Real-time price ranges for compounded GLP-1 medications across all vetted telehealth providers. See the lowest, average, and highest prices at a glance.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <RefreshCw className="w-4 h-4" />
            <span>Prices updated regularly from provider listings</span>
          </div>
        </div>
      </section>

      {/* Price Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Current Market Prices</h2>
              <p className="text-muted-foreground text-sm mt-1">Price per vial, self-pay, all providers</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/compare">Compare Providers</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medications?.map((med) => (
                <MedicationPriceCard key={med.slug} slug={med.slug} name={med.name} drugClass={med.drugClass} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Context */}
      <section className="py-16 bg-muted/30 border-t px-4">
        <div className="container mx-auto max-w-3xl space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground">How We Track Prices</h2>
          <p>
            Pepcheck collects pricing directly from telehealth provider websites and pharmacy listings. Prices are verified by our team and updated when changes are detected. We cross-reference pricing against provider ordering pages to ensure accuracy.
          </p>
          <p>
            Prices shown are per-vial self-pay rates. Providers may also offer monthly subscription plans that bundle consultation fees, medications, and shipping. Always check the provider's current pricing page before purchasing.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild><Link href="/compare">Compare Providers</Link></Button>
            <Button asChild variant="outline"><Link href="/methodology">Our Methodology</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
