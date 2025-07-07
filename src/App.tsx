
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import CompanyList from "./components/CompanyList";
import PasswordChange from "./components/PasswordChange";
import TeamMembers from "./components/TeamMembers";
import EmailChange from "./components/EmailChange";
import TeamInvitation from "./components/TeamInvitation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/invitation" element={<TeamInvitation />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="companies" element={<CompanyList />} />
            <Route path="password-change" element={<PasswordChange />} />
            <Route path="email-change" element={<EmailChange />} />
            <Route path="team-members" element={<TeamMembers />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
