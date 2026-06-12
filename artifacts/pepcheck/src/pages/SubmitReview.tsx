import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListProviders, useSubmitReview } from "@workspace/api-client-react";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  providerId: z.coerce.number().min(1, "Please select a provider"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters long").max(1000),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitReview() {
  const [_, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const providerIdParam = params.get("provider");
  const { toast } = useToast();

  const { data: providers, isLoading: isProvidersLoading } = useListProviders();
  const submitReview = useSubmitReview();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: providerIdParam ? parseInt(providerIdParam) : 0,
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    submitReview.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Review submitted successfully",
          description: "Thank you for sharing your experience to help other patients.",
        });
        setLocation(`/providers/${data.providerId}`);
      },
      onError: (error) => {
        toast({
          title: "Error submitting review",
          description: error.error || "Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="text-center pb-8 border-b bg-muted/20">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <CardTitle className="text-3xl font-bold">Write a Review</CardTitle>
          <CardDescription className="text-base mt-2">
            Your honest feedback helps maintain accountability and transparency in the compounding market.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-6 sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Which provider did you use?</FormLabel>
                    <Select 
                      disabled={isProvidersLoading} 
                      onValueChange={(v) => field.onChange(parseInt(v))} 
                      defaultValue={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers?.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Overall Rating</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => field.onChange(star)}
                            className={`p-2 rounded-full transition-colors ${field.value >= star ? 'text-yellow-500' : 'text-muted-foreground hover:bg-muted'}`}
                          >
                            <Star className={`w-8 h-8 ${field.value >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex justify-between">
                      Your Experience
                      <span className="text-xs font-normal text-muted-foreground mt-1">Min. 10 characters</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Consider mentioning: shipping times, customer service responsiveness, packaging quality, and ease of use." 
                        className="resize-none h-40 text-base p-4" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-800">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                <p>
                  <strong>Trust & Safety:</strong> Reviews are monitored for spam. Please do not include personal medical information or specific dosage instructions in your review.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 h-12"
                  disabled={submitReview.isPending}
                >
                  {submitReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
