import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import PointsCalculation from "@/pages/PointsCalculation";
import PointsOfContact from "@/pages/PointsOfContact";
import EventsTimeline from "@/pages/EventsTimeline";
import Gallery from "@/pages/Gallery";
import ReportGeneration from "@/pages/ReportGeneration";
import MenuPage from "@/pages/MenuPage";
import NotFound from "@/pages/not-found";
import AdminRegister from "@/pages/AdminRegister";
import AdminDashboard from "@/pages/AdminDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/points" component={PointsCalculation} />
      <Route path="/contacts" component={PointsOfContact} />
      <Route path="/timeline" component={EventsTimeline} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/report" component={ReportGeneration} />
      <Route path="/menu" component={MenuPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar />
          <Router />
          {location !== "/menu" && <Footer />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
