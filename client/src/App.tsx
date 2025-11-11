import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import PointsCalculation from "@/pages/PointsCalculation";
import EventsTimeline from "@/pages/EventsTimeline";
import Gallery from "@/pages/Gallery";
import ReportGeneration from "@/pages/ReportGeneration";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/points" component={PointsCalculation} />
      <Route path="/timeline" component={EventsTimeline} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/report" component={ReportGeneration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
