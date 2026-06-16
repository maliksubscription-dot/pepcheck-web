import { useRoute, Link } from "wouter";
import { useGetProvider, useListProviderReviews, useTrackProviderClick, getGetProviderQueryKey, getListProviderReviewsQueryKey } from "@workspace/api-client-react";
import { StateAvailabilityLegalStatus } from "@workspace/api-client-react";
import {
  ShieldCheck, Star, MapPin, Globe, CheckCircle2, AlertTriangle, XCircle,
  ExternalLink, Pill, Truck, Clock, Package, DollarSign, ThumbsUp, ThumbsDown, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustBadges } from "@/components/TrustBadges";
import { format } from "date-fns";

const statusColorMap: Record<StateAvailabilityLegalStatus, string> = {
  legal: "bg-green-100 text-green-800 border-green-200",
  gray_zone: "bg-yellow-100 text-yellow-800 border-yellow-200",
  restricted: "bg-orange-100 text-orange-800 border-orange-200",
  unavailable: "bg-red-100 text-red-800 border-red-200",
};

const statusIconMap = {
  legal: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  gray_zone: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
  restricted: <AlertTriangle className="w-4 h-4 text-orange-600" />,
  unavailable: <XCircle className="w-4 h-4 text-red-600" />,
};

export default function ProviderDetail() {
  const [match, params] = useRoute("/providers/:id");
  const providerId = match && params?.id ? parseInt(params.id) : 0;

  const { data: provider, isLoading } = useGetProvider(providerId, {
    query: { queryKey: getGetProviderQueryKey(providerId), enabled: !!providerId },
  });
  const { data: reviews, isLoading: isReviewsLoading } = useListProviderReviews(providerId, {
    query: { queryKey: getListProviderReviewsQueryKey(providerId), enabled: !!providerId },
  });
  const trackClick = useTrackProviderClick();

  const handleVisit = () => {
    if (!provider) return;
    trackClick.mutate({ data: { providerId: provider.id, source: "provider-detail" } });
    console.log(`[pepcheck] visit_provider: ${provider.id}`);
    window.open(provider.website || "#", "_blank", "noopener noreferrer");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!provider) return <div className="text-center py-24">Provider not found</div>;

  const listingsByMedication = provider.listings.reduce((acc, l) => {
    if (!acc[l.medicationName]) acc[l.medicationName] = [];
    acc[l.medicationName].push(l);
    return acc;
  }, {} as Record<string, typeof provider.listings>);

  const pros: string[] = provider.pros ? JSON.parse(provider.pros) : [];
  const cons: string[] = provider.cons ? JSON.parse(provider.cons) : [];

  const cheapestListing = provider.listings.length > 0
    ? [...provider.listings].sort((a, b) => a.pricePerVial - b.pricePerVial)[0]
    : null;

  return (
    <div className="bg-muted/10 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white rounded-2xl border-2 shadow-sm flex items-center justify-center p-3">
              {provider.logoUrl
                ? <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                : <span className="text-4xl font-bold text-primary">{provider.name.charAt(0)}</span>}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3 flex-wrap">
                    {provider.name}
                    {provider.verified && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                    {provider.featured && <Badge variant="secondary">Featured</Badge>}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-muted-foreground">
                    {provider.rating && (
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {provider.rating.toFixed(1)}
                        <span className="text-muted-foreground font-normal">({provider.reviewCount} reviews)</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {provider.stateAvailability.filter(s => s.legalStatus === "legal").length} states served</span>
                    {provider.website && (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                  </div>
                </div>
                <Button size="lg" className="shrink-0 font-semibold" onClick={handleVisit}>
                  Visit Provider <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <TrustBadges verified={provider.verified} lastVerified={provider.lastVerified} freeShipping={provider.freeShipping} availableNow={provider.availableNow} />

              {provider.description && (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{provider.description}</p>
              )}
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: DollarSign, label: "Starting Price", value: cheapestListing ? `$${cheapestListing.pricePerVial}` : "—", note: "/vial" },
              { icon: DollarSign, label: "First Month", value: provider.firstMonthCost ? `$${provider.firstMonthCost}` : "—", note: "" },
              { icon: DollarSign, label: "Ongoing", value: provider.ongoingMonthlyCost ? `$${provider.ongoingMonthlyCost}/mo` : "—", note: "" },
              { icon: Package, label: "Consultation", value: provider.consultationIncluded ? "Included" : provider.consultationFee != null ? `$${provider.consultationFee}` : "—", note: "", highlight: provider.consultationIncluded },
              { icon: Truck, label: "Shipping", value: provider.freeShipping ? "Free" : provider.shippingFee != null ? `$${provider.shippingFee}` : "—", note: "", highlight: provider.freeShipping },
            ].map(({ icon: Icon, label, value, note, highlight }) => (
              <div key={label} className="bg-muted/30 border rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1.5">
                  <Icon className="w-3 h-3" /> {label}
                </div>
                <div className={`font-black text-lg leading-tight ${highlight ? "text-green-600" : "text-foreground"}`}>{value}</div>
                {note && <div className="text-xs text-muted-foreground">{note}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="pricing">
          <TabsList className="mb-6 w-full justify-start h-auto p-1 bg-background border rounded-lg overflow-x-auto">
            <TabsTrigger value="pricing" className="py-2 px-5">Pricing</TabsTrigger>
            <TabsTrigger value="overview" className="py-2 px-5">Overview</TabsTrigger>
            <TabsTrigger value="availability" className="py-2 px-5">State Availability</TabsTrigger>
            <TabsTrigger value="reviews" className="py-2 px-5">Reviews ({provider.reviewCount})</TabsTrigger>
          </TabsList>

          {/* Pricing tab */}
          <TabsContent value="pricing" className="space-y-6 focus-visible:outline-none">
            {/* Price breakdown */}
            <Card>
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
                <CardDescription>Full cost breakdown including all fees</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {[
                      { label: "Starting vial price", value: cheapestListing ? `$${cheapestListing.pricePerVial}` : "—", note: "lowest concentration" },
                      { label: "First month cost", value: provider.firstMonthCost ? `$${provider.firstMonthCost}` : "Varies", note: "may include first consultation" },
                      { label: "Ongoing monthly cost", value: provider.ongoingMonthlyCost ? `$${provider.ongoingMonthlyCost}/mo` : "Varies" },
                      { label: "Consultation fee", value: provider.consultationIncluded ? "Included" : provider.consultationFee != null ? `$${provider.consultationFee}` : "Varies", highlight: provider.consultationIncluded },
                      { label: "Shipping fee", value: provider.freeShipping ? "Free" : provider.shippingFee != null ? `$${provider.shippingFee}` : "Varies", highlight: provider.freeShipping },
                      { label: "Avg delivery time", value: provider.avgDeliveryDays ? `${provider.avgDeliveryDays} business days` : "—" },
                    ].map(({ label, value, note, highlight }) => (
                      <TableRow key={label}>
                        <TableCell className="font-medium text-sm pl-6 py-4">{label}</TableCell>
                        <TableCell className={`font-bold text-sm py-4 ${highlight ? "text-green-600" : ""}`}>{value}</TableCell>
                        {note && <TableCell className="text-xs text-muted-foreground py-4 pr-6">{note}</TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Listings by medication */}
            {Object.entries(listingsByMedication).map(([medName, listings]) => (
              <Card key={medName} className="overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="w-5 h-5 text-primary" /> {medName} — Available Vials
                  </CardTitle>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concentration</TableHead>
                      <TableHead>Vial Size</TableHead>
                      <TableHead>Total mg</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.sort((a, b) => a.pricePerVial - b.pricePerVial).map(listing => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.concentrationMgMl} mg/mL</TableCell>
                        <TableCell>{listing.vialSizeMl} mL</TableCell>
                        <TableCell className="text-muted-foreground">{(listing.concentrationMgMl * listing.vialSizeMl).toFixed(0)} mg</TableCell>
                        <TableCell>
                          {listing.inStock
                            ? <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">In Stock</Badge>
                            : <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Out of Stock</Badge>}
                        </TableCell>
                        <TableCell className="text-right text-lg font-bold text-primary">${listing.pricePerVial}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </TabsContent>

          {/* Overview tab */}
          <TabsContent value="overview" className="focus-visible:outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pros.length > 0 && (
                <Card>
                  <CardHeader className="border-b bg-green-50/50">
                    <CardTitle className="text-base flex items-center gap-2 text-green-700">
                      <ThumbsUp className="w-5 h-5" /> Pros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <ul className="space-y-2">
                      {pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {cons.length > 0 && (
                <Card>
                  <CardHeader className="border-b bg-red-50/50">
                    <CardTitle className="text-base flex items-center gap-2 text-red-700">
                      <ThumbsDown className="w-5 h-5" /> Cons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <ul className="space-y-2">
                      {cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {provider.pharmacyInfo && (
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" /> Pharmacy Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{provider.pharmacyInfo}</p>
                </CardContent>
              </Card>
            )}

            {/* Important Disclaimer */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="border-b border-amber-200">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <Info className="w-5 h-5" /> Important Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-sm text-amber-900/80 leading-relaxed">
                  Pepcheck does not provide medical advice, prescribe medication, or sell medication. Provider information is for comparison purposes only and should be verified directly with the provider before making a healthcare decision. Pricing and availability may change without notice. Always consult with a licensed healthcare professional before starting any medication.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/disclaimer">Full Disclaimer</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/methodology">Our Methodology</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability tab */}
          <TabsContent value="availability" className="focus-visible:outline-none">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>Where {provider.name} operates</CardTitle>
                <CardDescription>Shipping availability and legal status by state. Regulations change frequently — verify directly with {provider.name} before ordering.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px] pl-6">State</TableHead>
                      <TableHead className="w-[180px]">Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.stateAvailability.map(state => (
                      <TableRow key={state.stateCode}>
                        <TableCell className="pl-6 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <Link href={`/states/${state.stateCode.toLowerCase()}`} className="hover:text-primary transition-colors">
                              {state.stateName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColorMap[state.legalStatus]}`}>
                            {statusIconMap[state.legalStatus]}
                            {state.legalStatus.replace("_", " ").toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{state.notes || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews tab */}
          <TabsContent value="reviews" className="focus-visible:outline-none space-y-6">
            <div className="flex justify-between items-center bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary">{provider.rating?.toFixed(1) || "—"}</div>
                  <div className="flex text-yellow-500 justify-center my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(provider.rating || 0) ? "fill-current" : "text-muted"}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{provider.reviewCount} reviews</div>
                </div>
              </div>
              <Button asChild>
                <Link href={`/submit-review?provider=${provider.id}`}>Write a Review</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {isReviewsLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : reviews?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                  No reviews yet. Be the first!
                </div>
              ) : (
                reviews?.map(review => {
                  const displayName = review.reviewerName || "Patient";
                  const avatarLetter = displayName.charAt(0).toUpperCase();
                  const sourceColors: Record<string, string> = {
                    Trustpilot: "bg-green-50 text-green-700 border-green-200",
                    Google: "bg-blue-50 text-blue-700 border-blue-200",
                  };
                  const sourceBadgeClass = review.source ? (sourceColors[review.source] ?? "bg-muted text-muted-foreground border-border") : "";
                  return (
                  <Card key={review.id} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">{avatarLetter}</div>
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                              {displayName}
                              {review.verified && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Verified</Badge>}
                              {review.source && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${sourceBadgeClass}`}>
                                  {review.source}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMMM d, yyyy")}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/90">{review.comment}</p>
                    </CardContent>
                  </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
