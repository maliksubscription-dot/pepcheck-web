import { useListStates } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { MapPin, ChevronRight, CheckCircle, AlertTriangle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  legal: { label: "Available", color: "text-green-600", icon: CheckCircle },
  mixed: { label: "Mixed", color: "text-amber-600", icon: AlertTriangle },
  gray_zone: { label: "Gray Zone", color: "text-amber-600", icon: AlertTriangle },
  restricted: { label: "Restricted", color: "text-orange-600", icon: MinusCircle },
  unavailable: { label: "Unavailable", color: "text-red-400", icon: MinusCircle },
};

export default function States() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const { data: states, isLoading } = useListStates();

  const filtered = states?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-6 h-6 text-primary-foreground/70" />
            <span className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Coverage by State</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">GLP-1 Providers by State</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
            Compounded GLP-1 availability and legality varies by state. Select your state to see which vetted providers can legally serve you.
          </p>
          <div className="max-w-sm">
            <Input
              placeholder="Search states..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              data-testid="input-state-search"
            />
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array(20).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No states matched "{search}"</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered?.map((state) => {
                const cfg = statusConfig[state.legalStatusSummary] || statusConfig.legal;
                const Icon = cfg.icon;
                return (
                  <Card
                    key={state.code}
                    className="cursor-pointer hover:border-primary/60 hover:shadow-sm transition-all group"
                    onClick={() => setLocation(`/states/${state.code.toLowerCase()}`)}
                    data-testid={`card-state-${state.code}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl font-black text-primary">{state.code}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                      </div>
                      <p className="text-sm font-medium text-foreground leading-tight mb-2">{state.name}</p>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{state.providerCount} providers</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Methodology note */}
      <section className="border-t py-10 bg-muted/30 px-4">
        <div className="container mx-auto max-w-3xl text-center text-sm text-muted-foreground">
          <p>
            Legality data is sourced from state pharmacy board guidance, FDA shortage designations, and telehealth provider licensing records. Status reflects conditions as of our last data refresh. 
            <a href="/methodology" className="text-primary hover:underline ml-1">Learn about our methodology →</a>
          </p>
        </div>
      </section>
    </div>
  );
}
