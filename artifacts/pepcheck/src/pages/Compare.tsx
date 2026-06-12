import { useState, useMemo } from "react";
import { useLocation, useSearch, Link } from "wouter";
import {
  useListProviders, useListStates, useListMedications,
  useCompareProviders, getCompareProvidersQueryKey,
  useTrackProviderClick,
} from "@workspace/api-client-react";
import {
  ShieldCheck, Star, MapPin, SlidersHorizontal, ArrowLeftRight, X,
  ArrowRight, Package, Clock, DollarSign, CheckCircle, Filter,
  TrendingDown, Truck,
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
import { TrustBadges } from "@/components/TrustBadges";

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

export default function Compare() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const stateParam = searchParams.get("state") || undefined;
  const medicationParam = searchParams.get("medication") || undefined;
  const sortParam = (searchParams.get("sort") as "price_asc" | "price_desc" | "rating_desc" | "featured") || "price_asc";

  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [consultationIncludedOnly, setConsultationIncludedOnly] = useState(false);

  const { data: providers, isLoading } = useListProviders({ state: stateParam, medication: medicationParam, sort: sortParam });
  const { data: medications } = useListMedications();
  const trackClick = useTrackProviderClick();

  const { data: comparisonData, isLoading: isComparisonLoading } = useCompareProviders(
    { ids: selectedToCompare.join(",") },
    { query: { queryKey: getCompareProvidersQueryKey({ ids: selectedToCompare.join(",") }), enabled: isCompareMode && selectedToCompare.length > 0 } }
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchString);
    if (value && value !== "all") { params.set(key, value); } else { params.delete(key); }
    if (key === "state") console.log(`[pepcheck] state_filter: ${value}`);
    if (key === "medication") console.log(`[pepcheck] medication_filter: ${value}`);
    if (key === "sort") console.log(`[pepcheck] sort_changed: ${value}`);
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
    trackClick.mutate({ data: { providerId, source: "compare" } });
    console.log(`[pepcheck] visit_provider: ${providerId}`);
    if (website) window.open(website, "_blank", "noopener noreferrer");
  };

  const filteredProviders = useMemo(() => {
    if (!providers) return [];
    return providers.filter(p => {
      if (freeShippingOnly && !p.freeShipping) return false;
      if (verifiedOnly && !p.verified) return false;
      if (consultationIncludedOnly && !p.consultationIncluded) return false;
      return true;
    });
  }, [providers, freeShippingOnly, verifiedOnly, consultationIncludedOnly]);

  const stateName = stateParam ? US_STATES.find(([c]) => c === stateParam)?.[1] || stateParam : null;
  const medName = medicationParam ? medications?.find(m => m.slug === medicationParam)?.name || medicationParam : null;

  const pageTitle = stateName && medName
    ? `Compare ${medName} Providers in ${stateName}`
    : stateName
    ? `GLP-1 Providers Available in ${stateName}`
    : medName
    ? `Compare ${medName} Providers`
    : "Compare GLP-1 Providers";

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="bg-primary text-primary-foreground py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{pageTitle}</h1>
          <p className="text-primary-foreground/75 text-sm">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""} matched
            {stateName ? ` · Available in ${stateName}` : ""}
            {medName ? ` · ${medName}` : ""}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Compare bar */}
        {selectedToCompare.length > 0 && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-4">
            <span className="text-sm font-semibold px-1">{selectedToCompare.length}/3 selected for comparison</span>
            <Button size="sm" onClick={() => { setIsCompareMode(true); console.log(`[pepcheck] compare_side_by_side: ${selectedToCompare.join(",")}`); }} disabled={selectedToCompare.length < 2}>
              <ArrowLeftRight className="w-4 h-4 mr-2" /> Compare Side-by-Side
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedToCompare([])} className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center gap-2 font-bold border-b pb-4">
                  <Filter className="w-4 h-4" /> Filters
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State</label>
                  <Select value={stateParam || "all"} onValueChange={(v) => handleFilterChange("state", v)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="All States" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {US_STATES.map(([code, name]) => (
                        <SelectItem key={code} value={code}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medication</label>
                  <Select value={medicationParam || "all"} onValueChange={(v) => handleFilterChange("medication", v)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="All Medications" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Medications</SelectItem>
                      {medications?.map(m => (
                        <SelectItem key={m.slug} value={m.slug}>{m.name}</SelectItem>
                      ))}
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
                    { id: "verified-only", label: "Verified Only", state: verifiedOnly, setter: setVerifiedOnly },
                    { id: "consult-included", label: "Consultation Included", state: consultationIncludedOnly, setter: setConsultationIncludedOnly },
                  ].map(({ id, label, state, setter }) => (
                    <div key={id} className="flex items-center gap-2">
                      <Switch id={id} checked={state} onCheckedChange={setter} />
                      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-xl" />)
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-24 bg-muted/10 border border-dashed rounded-xl">
                <TrendingDown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">No providers match your filters</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                  Try removing some filters or selecting a different state or medication.
                </p>
                <Button variant="outline" onClick={() => setLocation("/compare")}>Clear All Filters</Button>
              </div>
            ) : (
              filteredProviders.map((provider, idx) => (
                <Card
                  key={provider.id}
                  className={`overflow-hidden transition-all ${selectedToCompare.includes(provider.id) ? "border-primary ring-1 ring-primary" : "hover:border-primary/40"}`}
                  data-testid={`card-provider-${provider.id}`}
                >
                  <CardContent className="p-0">
                    {/* Mobile layout */}
                    <div className="flex flex-col md:hidden p-5 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-muted border flex items-center justify-center shrink-0">
                          {provider.logoUrl
                            ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                            : <span className="font-black text-primary text-lg">{provider.name.charAt(0)}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg leading-tight">{provider.name}</h3>
                            {provider.verified && <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />}
                            {idx === 0 && <span className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded shrink-0">BEST PRICE</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm mt-0.5">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                            <span className="font-semibold">{provider.rating?.toFixed(1) || "N/A"}</span>
                            <span className="text-muted-foreground">({provider.reviewCount})</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-primary">${provider.minPrice}</div>
                          <div className="text-xs text-muted-foreground">/vial</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.freeShipping ? "Free" : provider.shippingFee != null ? `$${provider.shippingFee}` : "—"}</div>
                          <div className="text-muted-foreground">Shipping</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.avgDeliveryDays ? `${provider.avgDeliveryDays}d` : "—"}</div>
                          <div className="text-muted-foreground">Delivery</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <div className="font-bold">{provider.consultationIncluded ? "Incl." : provider.consultationFee != null ? `$${provider.consultationFee}` : "—"}</div>
                          <div className="text-muted-foreground">Consult</div>
                        </div>
                      </div>

                      <TrustBadges verified={provider.verified} lastVerified={provider.lastVerified} freeShipping={provider.freeShipping} availableNow={provider.availableNow} size="sm" />

                      <div className="flex gap-2">
                        <Button variant={selectedToCompare.includes(provider.id) ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => toggleCompare(provider.id)}>
                          {selectedToCompare.includes(provider.id) ? "✓ Selected" : "Compare"}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" asChild onClick={() => console.log(`[pepcheck] view_details: ${provider.id}`)}>
                          <Link href={`/providers/${provider.id}`}>Details</Link>
                        </Button>
                        {provider.website && (
                          <Button size="sm" className="flex-1" onClick={() => handleVisit(provider.id, provider.website)}>
                            Visit <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:flex">
                      {/* Left: provider info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-muted border flex items-center justify-center shrink-0">
                            {provider.logoUrl
                              ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                              : <span className="font-black text-primary text-xl">{provider.name.charAt(0)}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-xl">{provider.name}</h3>
                              {provider.verified && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                  <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                              )}
                              {provider.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                              {idx === 0 && <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">BEST PRICE</span>}
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{provider.rating?.toFixed(1) || "N/A"}</span>
                              <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                              <span className="text-muted-foreground">·</span>
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{provider.statesAvailable} states</span>
                            </div>
                            <TrustBadges verified={provider.verified} lastVerified={provider.lastVerified} freeShipping={provider.freeShipping} availableNow={provider.availableNow} size="sm" />
                          </div>
                        </div>

                        {/* Data chips */}
                        <div className="mt-5 grid grid-cols-4 gap-3">
                          <div className="border rounded-lg p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" /> Starting</div>
                            <div className="text-xl font-black text-primary">${provider.minPrice}</div>
                          </div>
                          <div className="border rounded-lg p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Truck className="w-3 h-3" /> Shipping</div>
                            <div className="font-bold text-sm">{provider.freeShipping ? <span className="text-green-600">Free</span> : provider.shippingFee != null ? `$${provider.shippingFee}` : "—"}</div>
                          </div>
                          <div className="border rounded-lg p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Delivery</div>
                            <div className="font-bold text-sm">{provider.avgDeliveryDays ? `${provider.avgDeliveryDays} days` : "—"}</div>
                          </div>
                          <div className="border rounded-lg p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Consult</div>
                            <div className="font-bold text-sm">
                              {provider.consultationIncluded
                                ? <span className="text-green-600">Included</span>
                                : provider.consultationFee != null
                                ? `$${provider.consultationFee}`
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: action */}
                      <div className="w-48 border-l flex flex-col items-center justify-center gap-3 p-6 bg-muted/10">
                        <Button
                          variant={selectedToCompare.includes(provider.id) ? "secondary" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => toggleCompare(provider.id)}
                        >
                          {selectedToCompare.includes(provider.id) ? "✓ Selected" : "Add to Compare"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                          onClick={() => console.log(`[pepcheck] view_details: ${provider.id}`)}
                        >
                          <Link href={`/providers/${provider.id}`}>View Details</Link>
                        </Button>
                        {provider.website && (
                          <Button size="sm" className="w-full" onClick={() => handleVisit(provider.id, provider.website)}>
                            Visit Provider <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
                      <TableHead className="w-[200px] border-r font-semibold">Feature</TableHead>
                      {comparisonData.map(p => (
                        <TableHead key={p.id} className="min-w-[220px] border-r align-top py-5">
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-14 h-14 rounded-xl bg-background border flex items-center justify-center">
                              {p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" /> : <span className="font-bold text-primary text-lg">{p.name.charAt(0)}</span>}
                            </div>
                            <div className="font-bold text-base">{p.name}</div>
                            <div className="flex items-center text-xs gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              {p.rating?.toFixed(1) || "N/A"} ({p.reviewCount})
                            </div>
                            <div className="flex flex-col gap-1 w-full mt-1">
                              <Button size="sm" className="w-full text-xs" onClick={() => { setIsCompareMode(false); setLocation(`/providers/${p.id}`); console.log(`[pepcheck] view_details: ${p.id}`); }}>View Details</Button>
                              {p.website && <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => { handleVisit(p.id, p.website); setIsCompareMode(false); }}>Visit Provider</Button>}
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Starting Price", render: (p: typeof comparisonData[0]) => <span className="text-xl font-black text-primary">${Math.min(...p.listings.map(l => l.pricePerVial))}/vial</span> },
                      { label: "Consultation Fee", render: (p: typeof comparisonData[0]) => p.consultationIncluded ? <span className="text-green-600 font-semibold">Included ✓</span> : p.consultationFee != null ? `$${p.consultationFee}` : "—" },
                      { label: "Shipping", render: (p: typeof comparisonData[0]) => p.freeShipping ? <span className="text-green-600 font-semibold">Free ✓</span> : p.shippingFee != null ? `$${p.shippingFee}` : "—" },
                      { label: "Avg Delivery", render: (p: typeof comparisonData[0]) => p.avgDeliveryDays ? `${p.avgDeliveryDays} days` : "—" },
                      { label: "States Served", render: (p: typeof comparisonData[0]) => `${p.stateAvailability.filter(s => s.legalStatus === "legal").length} states` },
                      { label: "Medications", render: (p: typeof comparisonData[0]) => <div className="flex flex-wrap gap-1 justify-center">{Array.from(new Set(p.listings.map(l => l.medicationName))).map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}</div> },
                      { label: "Verified", render: (p: typeof comparisonData[0]) => p.verified ? <span className="text-green-600 font-semibold flex items-center gap-1 justify-center"><ShieldCheck className="w-4 h-4" /> Verified</span> : <span className="text-muted-foreground">Unverified</span> },
                      { label: "Last Verified", render: (p: typeof comparisonData[0]) => p.lastVerified ? new Date(p.lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                      { label: "Pharmacy", render: (p: typeof comparisonData[0]) => <span className="text-xs text-muted-foreground">{p.pharmacyInfo || "—"}</span> },
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
