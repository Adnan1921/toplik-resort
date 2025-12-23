import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import Index from "./pages/Index";
import Apartmani from "./pages/Apartmani";
import ApartmanDetails from "./pages/ApartmanDetails";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import ReservationInstructions from "./pages/admin/ReservationInstructions";
import SiteContent from "./pages/admin/SiteContent";
import EmailSettings from "./pages/admin/EmailSettings";
import MediaGallery from "./pages/admin/MediaGallery";
import Apartments from "./pages/admin/Apartments";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Index} />
        <Route path="/apartmani" component={Apartmani} />
        <Route path="/apartmani/:slug" component={ApartmanDetails} />
        
        {/* Admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/submissions">
          <ProtectedRoute>
            <ContactSubmissions />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/instructions">
          <ProtectedRoute>
            <ReservationInstructions />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/content">
          <ProtectedRoute>
            <SiteContent />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/email">
          <ProtectedRoute>
            <EmailSettings />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/media">
          <ProtectedRoute>
            <MediaGallery />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/apartments">
          <ProtectedRoute>
            <Apartments />
          </ProtectedRoute>
        </Route>
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
