import { useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useListProviders, useListStates, useListMedications, useCompareProviders } from "@workspace/api-client-react";
import { ShieldCheck, Star, Pill, MapPin, Search, SlidersHorizontal, ArrowLeftRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Compare() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const stateParam = searchParams.get("state") || undefined;
  const medicationParam = searchParams.get("medication") || undefined;
  const sortParam = (searchParams.get("sort") as any) || "price_asc";
  
  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const { data: providers, isLoading: isProvidersLoading } = useListProviders({
    state: stateParam,
    medication: medicationParam,
    sort: sortParam,
  });

  const { data: states, isLoading: isStatesLoading } = useListStates();
  const { data: medications, isLoading: isMedicationsLoading } = useListMedications();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchString);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setLocation(`/compare?${params.toString()}`);
  };

  const toggleCompare = (id: number) => {
    if (selectedToCompare.includes(id)) {
      setSelectedToCompare(selectedToCompare.filter(pId => pId !== id));
    } else if (selectedToCompare.length < 3) {
      setSelectedToCompare([...selectedToCompare, id]);
    }
  };

  const { data: comparisonData, isLoading: isComparisonLoading } = useCompareProviders(
    { ids: selectedToCompare.join(",") },
    { query: { enabled: isCompareMode && selectedToCompare.length > 0 } }
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Providers</h1>
          <p className="text-muted-foreground mt-1">Find the best GLP-1 provider for your needs and location.</p>
        </div>
        
        {selectedToCompare.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-sm font-medium px-2">{selectedToCompare.length}/3 selected</span>
            <Button 
              size="sm" 
              onClick={() => setIsCompareMode(true)}
              disabled={selectedToCompare.length < 2}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Compare Side-by-Side
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedToCompare([])} className="h-8 px-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 font-semibold text-lg border-b pb-4">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">State Availability</label>
                <Select value={stateParam || "all"} onValueChange={(v) => handleFilterChange("state", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states?.map(s => (
                      <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Medication</label>
                <Select value={medicationParam || "all"} onValueChange={(v) => handleFilterChange("medication", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Medications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Medications</SelectItem>
                    {medications?.map(m => (
                      <SelectItem key={m.slug} value={m.slug}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 border-t pt-6">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortParam} onValueChange={(v) => handleFilterChange("sort", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">Lowest Price First</SelectItem>
                    <SelectItem value="price_desc">Highest Price First</SelectItem>
                    <SelectItem value="rating_desc">Highest Rated</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {isProvidersLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : providers?.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 border border-dashed rounded-xl">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No providers found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Try adjusting your filters. Some medications may not be available in certain states due to local regulations.
              </p>
              <Button variant="outline" onClick={() => setLocation("/compare")}>Clear all filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {providers?.map((provider) => (
                <Card 
                  key={provider.id} 
                  className={`overflow-hidden transition-all ${selectedToCompare.includes(provider.id) ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border">
                              {provider.logoUrl ? (
                                <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="font-bold text-primary">{provider.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-xl flex items-center gap-2">
                                {provider.name}
                                {provider.verified && <ShieldCheck className="w-4 h-4 text-green-600" />}
                              </h3>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center text-yellow-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="font-semibold text-foreground ml-1">{provider.rating?.toFixed(1) || 'N/A'}</span>
                                </div>
                                <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Starting at</div>
                            <div className="text-2xl font-black text-primary">${provider.minPrice}</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {provider.description}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {provider.statesAvailable} states</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant={selectedToCompare.includes(provider.id) ? "secondary" : "outline"} 
                            size="sm"
                            onClick={() => toggleCompare(provider.id)}
                          >
                            {selectedToCompare.includes(provider.id) ? "Selected" : "Compare"}
                          </Button>
                          <Button size="sm" onClick={() => setLocation(`/providers/${provider.id}`)}>
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side-by-side comparison modal */}
      <Sheet open={isCompareMode} onOpenChange={setIsCompareMode}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[80vh] overflow-y-auto w-full p-0">
          <div className="container mx-auto px-4 py-8">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl">Provider Comparison</SheetTitle>
            </SheetHeader>
            
            {isComparisonLoading ? (
              <div className="flex gap-4">
                <Skeleton className="h-96 w-1/3" />
                <Skeleton className="h-96 w-1/3" />
                <Skeleton className="h-96 w-1/3" />
              </div>
            ) : comparisonData && (
              <div className="overflow-x-auto">
                <Table className="min-w-[800px] border">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[200px] border-r">Feature</TableHead>
                      {comparisonData.map(p => (
                        <TableHead key={p.id} className="min-w-[250px] border-r align-top py-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-xl bg-background border flex items-center justify-center mb-3">
                              {p.logoUrl ? (
                                <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="font-bold text-primary">{p.name.charAt(0)}</span>
                              )}
                            </div>
                            <h3 className="font-bold text-lg">{p.name}</h3>
                            <div className="flex items-center text-sm mt-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              {p.rating?.toFixed(1) || 'N/A'} ({p.reviewCount})
                            </div>
                            <Button className="w-full mt-4" size="sm" onClick={() => {
                              setIsCompareMode(false);
                              setLocation(`/providers/${p.id}`);
                            }}>View Full Profile</Button>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium border-r bg-muted/20">Base Price</TableCell>
                      {comparisonData.map(p => (
                        <TableCell key={p.id} className="border-r text-center font-bold text-lg">
                          ${Math.min(...p.listings.map(l => l.pricePerVial))}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium border-r bg-muted/20">States Served</TableCell>
                      {comparisonData.map(p => (
                        <TableCell key={p.id} className="border-r text-center">
                          {p.stateAvailability.filter(s => s.legalStatus === 'legal').length} states
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium border-r bg-muted/20 align-top">Medications Available</TableCell>
                      {comparisonData.map(p => {
                        const meds = Array.from(new Set(p.listings.map(l => l.medicationName)));
                        return (
                          <TableCell key={p.id} className="border-r align-top">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {meds.map(m => (
                                <Badge key={m} variant="secondary">{m}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
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
