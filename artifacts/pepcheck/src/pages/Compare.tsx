import { useState, useMemo } from "react";
import { useLocation, useSearch, Link } from "wouter";
import {
  useListProviders, useListMedications,
  useCompareProviders, getCompareProvidersQueryKey,
  useTrackProviderClick,
} from "@workspace/api-client-react";
import type { Provider } from "@workspace/api-client-react";
import {
  ShieldCheck, Star, ArrowLeftRight, X,
  ArrowRight, Package, Clock, DollarSign, Filter,
  TrendingDown, Truck, MapPin, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ProviderWithExtras = Provider & {
  bestFor?: string | null;
  pepcheckScore?: number | null;
  priceTransparency?: string | null;
  programType?: string | null;
  medicationIncluded?: boolean | null;
  medicationsOffered?: string | null;
};

function transparencyBadge(level: string | null | undefined) {
  if (level === "Clear") return "bg-green-100 text-green-800";
  if (level === "Partial") return "bg-yellow-100 text-yellow-800";
  if (level === "Low") return "bg-orange-100 text-orange-800";
  return "bg-muted text-muted-foreground";
}

function PriceCell({ value, suffix = "" }: { value: number | null | undefined; suffix?: string }) {
  if (value == null) return <span className="text-sm text-muted-foreground font-medium">Not publicly listed</span>;
  return <>{`$${value}${suffix}`}</>;
}

export default function Compare() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const stateParam = "TX";
  const medicationParam = searchParams.get("medication") || "all";
  const sortParam = (searchParams.get("sort") as "price_asc" | "price_desc" | "rating_desc" | "featured") || "price_asc";

  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [consultationIncludedOnly, setConsultationIncludedOnly] = useState(false);

  // For "both" and "all", don't pass medication to API — filter client-side
  const apiMedication = (medicationParam && medicationParam !== "all" && medicationParam !== "both")
    ? medicationParam
    : undefined;

  const { data: rawProviders, isLoading } = useListProviders({ state: stateParam, medication: apiMedication, sort: sortParam });
  const providers = (rawProviders || []) as ProviderWithExtras[];
  const trackClick = useTrackProviderClick();

  const { data: comparisonData, isLoading: isComparisonLoading } = useCompareProviders(
    { ids: selectedToCompare.join(",") },
    { query: { queryKey: getCompareProvidersQueryKey({ ids: selectedToCompare.join(",") }), enabled: isCompareMode && selectedToCompare.length > 0 } }
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchString);
    params.set("state", "TX");
    if (key === "medication") {
      console.log("Comparison page medication filter changed:", value);
    }
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setLocation(`/compare?${params.toString()}`);
  };

  const toggleCompare = (id: number) => {
    if (selectedToCompare.includes(id)) {
      setSelectedToCompare(selectedToCompare.filter(p => p !== id));
    } else if (selectedToCompare.length < 3) {
      setSelectedToCompare([...selectedToCompare, id]);
    }
  };

  const handleVisit = (providerId: number, website?: string | null) => {
    console.log("Visit Provider clicked:", providerId);
    trackClick.mutate({ data: { providerId, source: "compare" } });
    if (website) window.open(website, "_blank", "noopener noreferrer");
  };

  const handleViewDetails = (providerId: number) => {
    console.log("View Details clicked:", providerId);
  };

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const offered = (p.medicationsOffered || "").toLowerCase();
      if (medicationParam === "tirzepatide" && !offered.includes("tirzepatide")) return false;
      if (medicationParam === "semaglutide" && !offered.includes("semaglutide")) return false;
      if (medicationParam === "both") {
        if (!offered.includes("tirzepatide") || !offered.includes("semaglutide")) return false;
      }
      if (freeShippingOnly && !p.freeShipping) return false;
      if (consultationIncludedOnly && !p.consultationIncluded) return false;
      return true;
    });
  }, [providers, medicationParam, freeShippingOnly, consultationIncludedOnly]);

  const medLabel = medicationParam === "tirzepatide" ? "Tirzepatide" : medicationParam === "semaglutide" ? "Semaglutide" : medicationParam === "both" ? "Both medications" : null;

  return (
    <div className="w-full">
      {/* Texas Beta Banner */}
      <div className="bg-blue-600 text-white text-center text-sm py-2.5 px-4 font-medium">
        🇺🇸 Texas Beta — Currently comparing providers available in Texas. More states coming soon.
      </div>

      {/* Page header */}
      <div className="bg-primary text-primary-foreground py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Compare GLP-1 Providers in Texas
          </h1>
          <p className="text-primary-foreground/75 text-sm">
            {isLoading ? "Loading…" : `${filteredProviders.length} provider${filteredProviders.length !== 1 ? "s" : ""} available`}
            {medLabel ? ` · ${medLabel}` : ""}
            {" · "}Sorted by {sortParam === "price_asc" ? "lowest price" : sortParam === "rating_desc" ? "highest rated" : sortParam === "price_desc" ? "highest price" : "featured"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Compare selection bar */}
        {selectedToCompare.length > 0 && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-4">
            <span className="text-sm font-semibold px-1">{selectedToCompare.length}/3 selected for comparison</span>
            <Button size="sm" onClick={() => setIsCompareMode(true)} disabled={selectedToCompare.length < 2}>
              <ArrowLeftRight className="w-4 h-4 mr-2" /> Compare Side-by-Side
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedToCompare([])} className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center gap-2 font-bold border-b pb-4">
                  <Filter className="w-4 h-4" /> Filters
                </div>

                <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><span className="font-semibold text-blue-900">Texas</span> <span className="text-blue-600 text-xs font-semibold">Beta</span></span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medication</label>
                  <Select value={medicationParam} onValueChange={(v) => handleFilterChange("medication", v)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="All Medications" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Medications</SelectItem>
                      <SelectItem value="tirzepatide">Tirzepatide</SelectItem>
                      <SelectItem value="semaglutide">Semaglutide</SelectItem>
                      <SelectItem value="both">Both (Tirzepatide & Semaglutide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort By</label>
                  <Select value={sortParam} onValueChange={(v) => handleFilterChange("sort", v)}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">Lowest Price</SelectItem>
                      <SelectItem value="price_desc">Highest Price</SelectItem>
                      <SelectItem value="rating_desc">Highest Rated</SelectItem>
                      <SelectItem value="featured">Featured First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Filters</label>
                  {[
                    { id: "free-shipping", label: "Free Shipping", state: freeShippingOnly, setter: setFreeShippingOnly },
                    { id: "consult-included", label: "Consultation Included", state: consultationIncludedOnly, setter: setConsultationIncludedOnly },
                  ].map(({ id, label, state, setter }) => (
                    <div key={id} className="flex items-center gap-2">
                      <Switch id={id} checked={state} onCheckedChange={setter} />
                      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground mb-2">Price Transparency</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 shrink-0" /><span><span className="font-medium">Clear</span> — full price shown</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" /><span><span className="font-medium">Partial</span> — some costs hidden</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" /><span><span className="font-medium">Low</span> — pricing unclear</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Provider results */}
          <div className="lg:col-span-3 space-y-3">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-xl" />)
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-24 bg-muted/10 border border-dashed rounded-xl px-6">
                <TrendingDown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">
                  {medicationParam && medicationParam !== "all"
                    ? `No providers found for this medication in Texas yet.`
                    : "No providers match your filters"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-2">
                  {medicationParam && medicationParam !== "all"
                    ? "We're still adding providers. Join the price alert list to get notified when new options are added."
                    : "Try removing some filters to see more results."}
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button variant="outline" onClick={() => setLocation("/compare?state=TX&sort=price_asc")}>
                    Clear Filters
                  </Button>
                  <Button asChild>
                    <Link href="/#signup">
                      <Bell className="w-4 h-4 mr-2" /> Get Alerts
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              filteredProviders.map((provider, idx) => (
                <Card
                  key={provider.id}
                  className={`overflow-hidden transition-all ${selectedToCompare.includes(provider.id) ? "border-primary ring-1 ring-primary" : "hover:border-primary/40"}`}
                >
                  <CardContent className="p-0">
                    {/* Desktop */}
                    <div className="hidden md:flex">
                      {/* Identity */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-11 h-11 rounded-xl bg-muted border flex items-center justify-center shrink-0">
                            {provider.logoUrl
                              ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                              : <span className="font-black text-primary text-lg">{provider.name.charAt(0)}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-lg leading-tight">{provider.name}</h3>
                              {provider.verified && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                  <ShieldCheck className="w-3 h-3" /> Information checked
                                </span>
                              )}
                              {idx === 0 && sortParam === "price_asc" && (
                                <span className="text-[11px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">BEST PRICE</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-sm">
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                <span className="font-semibold">{provider.rating?.toFixed(1) || "N/A"}</span>
                                <span className="text-muted-foreground">({provider.reviewCount?.toLocaleString()})</span>
                              </span>
                              {provider.programType && (
                                <span className="bg-muted text-muted-foreground text-[11px] px-2 py-0.5 rounded-full border">
                                  {provider.programType}
                                </span>
                              )}
                              {provider.bestFor && (
                                <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                                  {provider.bestFor}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Shipping:</span>
                            <span className="font-medium">
                              {provider.freeShipping ? <span className="text-green-600">Free</span> : provider.shippingFee != null ? `$${provider.shippingFee}` : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Delivery:</span>
                            <span className="font-medium">{provider.avgDeliveryDays ? `${provider.avgDeliveryDays} days` : "—"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Consult:</span>
                            <span className="font-medium">
                              {provider.consultationIncluded
                                ? <span className="text-green-600">Included</span>
                                : provider.consultationFee != null ? `$${provider.consultationFee}` : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Transparency:</span>
                            {provider.priceTransparency
                              ? <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${transparencyBadge(provider.priceTransparency)}`}>{provider.priceTransparency}</span>
                              : <span className="text-muted-foreground">—</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {provider.medicationsOffered?.split(" • ").map(med => (
                            <span key={med} className="bg-muted/60 text-xs font-medium px-2 py-0.5 rounded-full border">{med}</span>
                          ))}
                          {provider.medicationIncluded === true && (
                            <span className="bg-green-100 text-green-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">Medication included</span>
                          )}
                          {provider.medicationIncluded === false && (
                            <span className="bg-orange-100 text-orange-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">Medication separate</span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Last verified: {provider.lastVerified
                            ? new Date(provider.lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="w-52 border-l bg-muted/10 flex flex-col justify-center px-5 py-6 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">First month</div>
                          <div className="text-3xl font-black text-primary leading-none">
                            <PriceCell value={provider.firstMonthCost} />
                          </div>
                          {provider.medicationIncluded === false && provider.firstMonthCost != null && (
                            <div className="text-[11px] text-orange-700 mt-0.5">Medication separate</div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Ongoing</div>
                          <div className="text-xl font-bold text-foreground leading-none">
                            <PriceCell value={provider.ongoingMonthlyCost} suffix="/mo" />
                          </div>
                        </div>
                        {provider.pepcheckScore != null && (
                          <div className="pt-3 border-t">
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Pepcheck Score</div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-primary">{provider.pepcheckScore.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground font-medium">/ 10</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="w-44 border-l flex flex-col items-stretch justify-center gap-2.5 p-5">
                        <Button
                          variant={selectedToCompare.includes(provider.id) ? "secondary" : "outline"}
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => toggleCompare(provider.id)}
                        >
                          {selectedToCompare.includes(provider.id) ? "✓ Selected" : "Add to Compare"}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs" asChild onClick={() => handleViewDetails(provider.id)}>
                          <Link href={`/providers/${provider.id}`}>View Details</Link>
                        </Button>
                        {provider.website && (
                          <Button size="sm" className="w-full font-bold" onClick={() => handleVisit(provider.id, provider.website)}>
                            Visit Provider <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col md:hidden p-4 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted border flex items-center justify-center shrink-0">
                          {provider.logoUrl
                            ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                            : <span className="font-black text-primary">{provider.name.charAt(0)}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <h3 className="font-bold text-base">{provider.name}</h3>
                            {provider.verified && <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs flex-wrap">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="font-semibold">{provider.rating?.toFixed(1)}</span>
                            {provider.bestFor && (
                              <span className="bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded-full">{provider.bestFor}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-primary leading-none">
                            {provider.firstMonthCost != null ? `$${provider.firstMonthCost}` : "—"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">first month</div>
                          {provider.ongoingMonthlyCost != null && (
                            <div className="text-sm font-bold">${provider.ongoingMonthlyCost}/mo</div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.freeShipping ? <span className="text-green-600">Free</span> : provider.shippingFee != null ? `$${provider.shippingFee}` : "—"}</div>
                          <div className="text-muted-foreground">Shipping</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.avgDeliveryDays ? `${provider.avgDeliveryDays}d` : "—"}</div>
                          <div className="text-muted-foreground">Delivery</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.consultationIncluded ? <span className="text-green-600">Incl.</span> : provider.consultationFee != null ? `$${provider.consultationFee}` : "—"}</div>
                          <div className="text-muted-foreground">Consult</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        {provider.pepcheckScore != null && (
                          <span className="flex items-center gap-1">
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-black text-primary">{provider.pepcheckScore.toFixed(1)}/10</span>
                          </span>
                        )}
                        {provider.medicationIncluded === true && (
                          <span className="bg-green-100 text-green-800 font-semibold px-1.5 py-0.5 rounded-full text-[11px]">Medication included</span>
                        )}
                        {provider.medicationIncluded === false && (
                          <span className="bg-orange-100 text-orange-800 font-semibold px-1.5 py-0.5 rounded-full text-[11px]">Medication separate</span>
                        )}
                        {provider.priceTransparency && (
                          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${transparencyBadge(provider.priceTransparency)}`}>
                            {provider.priceTransparency} transparency
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant={selectedToCompare.includes(provider.id) ? "secondary" : "outline"} size="sm" className="flex-1 text-xs" onClick={() => toggleCompare(provider.id)}>
                          {selectedToCompare.includes(provider.id) ? "✓" : "Compare"}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs" asChild onClick={() => handleViewDetails(provider.id)}>
                          <Link href={`/providers/${provider.id}`}>Details</Link>
                        </Button>
                        {provider.website && (
                          <Button size="sm" className="flex-1 font-bold text-xs" onClick={() => handleVisit(provider.id, provider.website)}>
                            Visit <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {filteredProviders.length > 0 && (
              <p className="text-xs text-muted-foreground text-center pt-2 px-4">
                Pepcheck does not sell medication or provide medical advice. Information should be verified directly with the provider. Medication availability varies.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison drawer */}
      <Sheet open={isCompareMode} onOpenChange={setIsCompareMode}>
        <SheetContent side="bottom" className="h-[88vh] overflow-y-auto w-full p-0">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl">Provider Comparison</SheetTitle>
            </SheetHeader>
            {isComparisonLoading ? (
              <div className="flex gap-4">
                {Array(selectedToCompare.length).fill(0).map((_, i) => <Skeleton key={i} className="h-96 flex-1" />)}
              </div>
            ) : comparisonData && (
              <div className="overflow-x-auto">
                <Table className="min-w-[700px] border rounded-xl overflow-hidden">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[180px] border-r font-semibold">Feature</TableHead>
                      {comparisonData.map(p => (
                        <TableHead key={p.id} className="min-w-[220px] border-r align-top py-5">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-background border flex items-center justify-center">
                              {p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" /> : <span className="font-bold text-primary text-lg">{p.name.charAt(0)}</span>}
                            </div>
                            <div className="font-bold">{p.name}</div>
                            <div className="flex items-center text-xs gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              {p.rating?.toFixed(1) || "N/A"}
                            </div>
                            <div className="flex flex-col gap-1 w-full mt-1">
                              <Button size="sm" className="w-full text-xs" onClick={() => { setIsCompareMode(false); handleViewDetails(p.id); setLocation(`/providers/${p.id}`); }}>View Details</Button>
                              {p.website && <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => { handleVisit(p.id, p.website); setIsCompareMode(false); }}>Visit Provider</Button>}
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "First Month", render: (p: typeof comparisonData[0]) => <span className="text-xl font-black text-primary">{p.firstMonthCost != null ? `$${p.firstMonthCost}` : "Not publicly listed"}</span> },
                      { label: "Ongoing/mo", render: (p: typeof comparisonData[0]) => <span className="font-bold">{p.ongoingMonthlyCost != null ? `$${p.ongoingMonthlyCost}` : "Not publicly listed"}</span> },
                      { label: "Consultation", render: (p: typeof comparisonData[0]) => p.consultationIncluded ? <span className="text-green-600 font-semibold">Included ✓</span> : p.consultationFee != null ? `$${p.consultationFee}` : "—" },
                      { label: "Shipping", render: (p: typeof comparisonData[0]) => p.freeShipping ? <span className="text-green-600 font-semibold">Free ✓</span> : p.shippingFee != null ? `$${p.shippingFee}` : "—" },
                      { label: "Delivery", render: (p: typeof comparisonData[0]) => p.avgDeliveryDays ? `${p.avgDeliveryDays} days` : "—" },
                      { label: "Medications", render: (p: typeof comparisonData[0]) => <div className="flex flex-wrap gap-1 justify-center">{Array.from(new Set(p.listings.map((l: any) => l.medicationName))).map((m: any) => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}</div> },
                      { label: "Last Verified", render: (p: typeof comparisonData[0]) => p.lastVerified ? new Date(p.lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                    ].map(({ label, render }) => (
                      <TableRow key={label}>
                        <TableCell className="font-medium border-r bg-muted/20 text-sm">{label}</TableCell>
                        {comparisonData.map(p => (
                          <TableCell key={p.id} className="border-r text-center text-sm">{render(p)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
