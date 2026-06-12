import { useListMedications, useListStates } from "@workspace/api-client-react";
import { Pill, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Medications() {
  const { data: medications, isLoading } = useListMedications();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">GLP-1 Medications Guide</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Understand the differences between compounded active ingredients, typical dosages, and what to look for when choosing a provider.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-4 text-amber-800">
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <strong>Important Disclaimer:</strong> Compounded medications are not FDA-approved, meaning the FDA does not evaluate them for safety, effectiveness, or quality before they are marketed. Always ensure your compounded medication comes from a State Board of Pharmacy licensed facility or an FDA-registered 503B outsourcing facility.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </>
        ) : (
          medications?.map(med => (
            <Card key={med.id} className="h-full flex flex-col hover:border-primary/30 transition-colors">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                      <Pill className="w-6 h-6 text-primary" /> {med.name}
                    </CardTitle>
                    <Badge variant="secondary">{med.drugClass}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p className="text-muted-foreground mb-6 flex-1">
                  {med.description || "Active pharmaceutical ingredient commonly used for weight management and metabolic health."}
                </p>
                
                <Button className="w-full mt-auto" variant="outline" asChild>
                  <Link href={`/compare?medication=${med.slug}`}>
                    View Providers & Prices
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="mt-16 bg-muted/30 rounded-2xl p-8 border">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" /> Terminology Cheat Sheet
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <strong className="block text-foreground mb-1">Active Ingredient</strong>
            <span className="text-muted-foreground">The actual drug inside the medication (e.g., semaglutide). Brand names like Wegovy or Ozempic are just trade names for this ingredient.</span>
          </div>
          <div>
            <strong className="block text-foreground mb-1">Concentration (mg/mL)</strong>
            <span className="text-muted-foreground">How strong the liquid is. A 5mg/mL concentration means every 1 milliliter of liquid contains 5 milligrams of the drug.</span>
          </div>
          <div>
            <strong className="block text-foreground mb-1">Vial Size (mL)</strong>
            <span className="text-muted-foreground">The physical volume of liquid in the bottle. To find total milligrams, multiply Concentration × Vial Size.</span>
          </div>
          <div>
            <strong className="block text-foreground mb-1">503A / 503B Pharmacy</strong>
            <span className="text-muted-foreground">Designations for compounding pharmacies. 503A pharmacies compound patient-specific prescriptions. 503B facilities manufacture in bulk and are subject to stricter CGMP standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
