import { Link, useLocation } from "wouter";
import { Search, MapPin, Pill, Activity, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetPlatformStats, useListFeaturedProviders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const [stateSearch, setStateSearch] = useState("");

  const { data: stats, isLoading: isStatsLoading } = useGetPlatformStats();
  const { data: featuredProviders, isLoading: isFeaturedLoading } = useListFeaturedProviders();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (stateSearch) {
      setLocation(`/compare?state=${stateSearch.toUpperCase()}`);
    } else {
      setLocation("/compare");
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-20 pb-24 md:pt-32 md:pb-40 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1 rounded-full w-fit text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Vetted Providers Only
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Clear prices.<br />Real pharmacies.<br />No BS.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-md">
                Compare compounded GLP-1 medications across vetted telehealth providers. Stop hunting through Reddit threads—find exactly what you need in seconds.
              </p>
              
              <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2 mt-4 bg-background p-2 rounded-lg shadow-lg">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter state code (e.g. CA, NY)" 
                    className="pl-9 border-none bg-transparent focus-visible:ring-0 text-foreground"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    maxLength={2}
                  />
                </div>
                <Button type="submit" size="lg" className="shrink-0 font-semibold shadow-none">
                  Find Providers
                </Button>
              </form>
            </div>
            
            <div className="hidden md:block">
              {/* Abstract Hero Image/Graphic */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary-foreground/5 rounded-[2rem] transform rotate-6 border border-primary-foreground/10" />
                <div className="absolute inset-0 bg-primary-foreground/10 rounded-[2rem] transform -rotate-3 border border-primary-foreground/20 backdrop-blur-sm flex flex-col p-8 justify-between">
                  <div className="space-y-4">
                    <div className="h-2 w-1/3 bg-primary-foreground/30 rounded-full" />
                    <div className="h-2 w-1/2 bg-primary-foreground/20 rounded-full" />
                    <div className="h-2 w-1/4 bg-primary-foreground/20 rounded-full" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-background rounded-xl p-4 shadow-xl flex items-center justify-between text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Provider A</div>
                          <div className="text-xs text-muted-foreground">Tirzepatide</div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">$299/mo</div>
                    </div>
                    <div className="bg-background rounded-xl p-4 shadow-xl flex items-center justify-between text-foreground opacity-90 transform translate-x-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Provider B</div>
                          <div className="text-xs text-muted-foreground">Semaglutide</div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">$199/mo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center gap-2">
              {isStatsLoading ? (
                <Skeleton className="h-10 w-24 mb-1" />
              ) : (
                <div className="text-4xl font-black text-primary">{stats?.verifiedProviders || 0}</div>
              )}
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Vetted Providers</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              {isStatsLoading ? (
                <Skeleton className="h-10 w-24 mb-1" />
              ) : (
                <div className="text-4xl font-black text-primary">{stats?.statesCovered || 0}</div>
              )}
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">States Covered</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              {isStatsLoading ? (
                <Skeleton className="h-10 w-24 mb-1" />
              ) : (
                <div className="text-4xl font-black text-primary">${Math.round(stats?.avgPricePerVial || 0)}</div>
              )}
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avg Price/Vial</div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              {isStatsLoading ? (
                <Skeleton className="h-10 w-24 mb-1" />
              ) : (
                <div className="text-4xl font-black text-primary">{stats?.totalReviews || 0}</div>
              )}
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Patient Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Trusted Platforms</h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                We independently verify the compounding pharmacies and state licenses for every provider listed on Pepcheck.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/compare">
                View All Providers <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isFeaturedLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/50">
                  <div className="h-32 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProviders?.map((provider) => (
                <Link key={provider.id} href={`/providers/${provider.id}`}>
                  <Card className="h-full overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                    <div className="p-6 border-b bg-muted/20 flex justify-between items-start">
                      <div className="w-16 h-16 rounded-xl bg-background border flex items-center justify-center overflow-hidden">
                        {provider.logoUrl ? (
                          <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="font-bold text-xl text-primary">{provider.name.charAt(0)}</div>
                        )}
                      </div>
                      {provider.verified && (
                        <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{provider.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="font-semibold text-sm">{provider.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-muted-foreground text-sm">({provider.reviewCount} reviews)</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {provider.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm font-medium">
                          From <span className="text-lg font-bold text-foreground">${provider.minPrice}</span>/mo
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {provider.statesAvailable} states
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/30 px-4 md:px-8 border-t border-b border-border/50">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">How Pepcheck Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Search & Filter</h3>
              <p className="text-muted-foreground">
                Enter your state and preferred medication to see all vetted providers that can legally ship to you.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Compare Prices</h3>
              <p className="text-muted-foreground">
                View side-by-side pricing, vial concentrations, and monthly costs without hiding behind paywalls.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Read Real Reviews</h3>
              <p className="text-muted-foreground">
                Make an informed decision based on verified patient experiences, shipping times, and support quality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
