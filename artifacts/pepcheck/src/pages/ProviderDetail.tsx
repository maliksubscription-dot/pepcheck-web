import { useRoute } from "wouter";
import { useGetProvider, useListProviderReviews } from "@workspace/api-client-react";
import { ShieldCheck, Star, MapPin, Globe, CheckCircle2, AlertTriangle, XCircle, Info, ExternalLink, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { StateAvailabilityLegalStatus, getGetProviderQueryKey, getListProviderReviewsQueryKey } from "@workspace/api-client-react";

const statusColorMap: Record<StateAvailabilityLegalStatus, string> = {
  legal: "bg-green-100 text-green-800 border-green-200",
  gray_zone: "bg-yellow-100 text-yellow-800 border-yellow-200",
  restricted: "bg-orange-100 text-orange-800 border-orange-200",
  unavailable: "bg-red-100 text-red-800 border-red-200"
};

const statusIconMap = {
  legal: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  gray_zone: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
  restricted: <AlertTriangle className="w-4 h-4 text-orange-600" />,
  unavailable: <XCircle className="w-4 h-4 text-red-600" />
};

export default function ProviderDetail() {
  const [match, params] = useRoute("/providers/:id");
  const providerId = match && params?.id ? parseInt(params.id) : 0;

  const { data: provider, isLoading: isProviderLoading } = useGetProvider(providerId, {
    query: { queryKey: getGetProviderQueryKey(providerId), enabled: !!providerId }
  });

  const { data: reviews, isLoading: isReviewsLoading } = useListProviderReviews(providerId, {
    query: { queryKey: getListProviderReviewsQueryKey(providerId), enabled: !!providerId }
  });

  if (isProviderLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!provider) {
    return <div className="text-center py-24">Provider not found</div>;
  }

  // Group listings by medication
  const listingsByMedication = provider.listings.reduce((acc, listing) => {
    if (!acc[listing.medicationName]) {
      acc[listing.medicationName] = [];
    }
    acc[listing.medicationName].push(listing);
    return acc;
  }, {} as Record<string, typeof provider.listings>);

  return (
    <div className="bg-muted/10 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white rounded-2xl border-2 border-border shadow-sm flex items-center justify-center p-4">
              {provider.logoUrl ? (
                <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-bold text-primary">{provider.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                    {provider.name}
                    {provider.verified && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none text-xs px-2 py-0.5">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center text-foreground font-medium">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      {provider.rating?.toFixed(1) || 'N/A'}
                      <span className="text-muted-foreground ml-1 font-normal">({provider.reviewCount} reviews)</span>
                    </div>
                    {provider.website && (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">
                        <Globe className="w-4 h-4 mr-1" /> Website
                      </a>
                    )}
                  </div>
                </div>
                
                <Button size="lg" asChild className="shrink-0">
                  <a href={provider.website || "#"} target="_blank" rel="noopener noreferrer">
                    Visit Provider <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {provider.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-background border rounded-lg overflow-x-auto">
            <TabsTrigger value="pricing" className="text-base py-2 px-6">Pricing & Formularies</TabsTrigger>
            <TabsTrigger value="availability" className="text-base py-2 px-6">State Availability</TabsTrigger>
            <TabsTrigger value="reviews" className="text-base py-2 px-6">Patient Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-8 focus-visible:outline-none">
            {Object.entries(listingsByMedication).map(([medName, listings]) => (
              <Card key={medName} className="overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Pill className="w-5 h-5 text-primary" /> {medName}
                  </CardTitle>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concentration</TableHead>
                      <TableHead>Vial Size</TableHead>
                      <TableHead>Total mg</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price per Vial</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.sort((a,b) => a.pricePerVial - b.pricePerVial).map(listing => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.concentrationMgMl} mg/mL</TableCell>
                        <TableCell>{listing.vialSizeMl} mL</TableCell>
                        <TableCell className="text-muted-foreground">
                          {listing.concentrationMgMl * listing.vialSizeMl} mg
                        </TableCell>
                        <TableCell>
                          {listing.inStock ? (
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">In Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Out of Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-lg font-bold text-primary">
                          ${listing.pricePerVial}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="availability" className="focus-visible:outline-none">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>Where {provider.name} operates</CardTitle>
                <CardDescription>
                  Compounding pharmacy regulations vary by state. This shows current shipping availability.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] pl-6">State</TableHead>
                      <TableHead className="w-[180px]">Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.stateAvailability.map(state => (
                      <TableRow key={state.stateCode}>
                        <TableCell className="pl-6 font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" /> {state.stateName}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColorMap[state.legalStatus]}`}>
                            {statusIconMap[state.legalStatus]}
                            {state.legalStatus.replace('_', ' ').toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {state.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="focus-visible:outline-none space-y-6">
            <div className="flex justify-between items-center bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary">{provider.rating?.toFixed(1) || '0.0'}</div>
                  <div className="flex text-yellow-500 justify-center my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.round(provider.rating || 0) ? 'fill-current' : 'text-muted'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{provider.reviewCount} total reviews</div>
                </div>
                <div className="w-px h-24 bg-border hidden sm:block" />
                <div className="hidden sm:block text-muted-foreground">
                  All reviews are from verified patients who have used {provider.name}.
                </div>
              </div>
              <Button asChild>
                <a href={`/submit-review?provider=${provider.id}`}>Write a Review</a>
              </Button>
            </div>

            <div className="grid gap-4">
              {isReviewsLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : reviews?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                reviews?.map(review => (
                  <Card key={review.id} className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                            P
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              Patient
                              {review.verified && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Verified Purchase</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMMM d, yyyy')}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground/90">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
