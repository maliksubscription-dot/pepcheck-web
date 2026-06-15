import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Compare from "@/pages/Compare";
import ProviderDetail from "@/pages/ProviderDetail";
import Medications from "@/pages/Medications";
import SubmitReview from "@/pages/SubmitReview";
import States from "@/pages/States";
import StatePage from "@/pages/StatePage";
import CheapestTirzepatide from "@/pages/CheapestTirzepatide";
import CheapestSemaglutide from "@/pages/CheapestSemaglutide";
import PriceTracker from "@/pages/PriceTracker";
import About from "@/pages/About";
import Methodology from "@/pages/Methodology";
import Disclaimer from "@/pages/Disclaimer";
import HowWeVerify from "@/pages/HowWeVerify";
import StayUpdated from "@/pages/StayUpdated";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compare" component={Compare} />
        <Route path="/providers/:id" component={ProviderDetail} />
        <Route path="/medications" component={Medications} />
        <Route path="/submit-review" component={SubmitReview} />
        <Route path="/states" component={States} />
        <Route path="/states/:code" component={StatePage} />
        <Route path="/cheapest-tirzepatide" component={CheapestTirzepatide} />
        <Route path="/cheapest-semaglutide" component={CheapestSemaglutide} />
        <Route path="/price-tracker" component={PriceTracker} />
        <Route path="/about" component={About} />
        <Route path="/methodology" component={Methodology} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/how-we-verify" component={HowWeVerify} />
        <Route path="/stay-updated" component={StayUpdated} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
