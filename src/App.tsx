
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import TechnicalDocumentation from "./pages/TechnicalDocumentation";
import FeatureDocumentation from "./pages/FeatureDocumentation";
import TermsOfService from "./pages/TermsOfService";
import ReportAbuse from "./pages/ReportAbuse";
import DataProtection from "./pages/DataProtection";
import SoulConnect from "./pages/SoulConnect";
import { AuthProvider } from "./hooks/useAuth";
import HeadScripts from "./components/HeadScripts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HeadScripts />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/technical" element={<TechnicalDocumentation />} />
            <Route path="/features" element={<FeatureDocumentation />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/report-abuse" element={<ReportAbuse />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/soul-connect" element={<SoulConnect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
