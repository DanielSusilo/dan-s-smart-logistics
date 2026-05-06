import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ManageShipments from "./pages/admin/ManageShipments.tsx";
import UserRegistry from "./pages/admin/UserRegistry.tsx";
import PendingVerifications from "./pages/customs/PendingVerifications.tsx";
import ClearedGoods from "./pages/customs/ClearedGoods.tsx";
import CustomerPortal from "./pages/customer/CustomerPortal.tsx";
import { WalletProvider } from "./context/WalletContext.tsx";
import { ShipmentsProvider } from "./context/ShipmentsContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WalletProvider>
          <ShipmentsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<ProtectedRoute allow="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/shipments" element={<ProtectedRoute allow="admin"><ManageShipments /></ProtectedRoute>} />
              <Route path="/admin/registry" element={<ProtectedRoute allow="admin"><UserRegistry /></ProtectedRoute>} />
              <Route path="/customs" element={<ProtectedRoute allow="bea-cukai"><PendingVerifications /></ProtectedRoute>} />
              <Route path="/customs/cleared" element={<ProtectedRoute allow="bea-cukai"><ClearedGoods /></ProtectedRoute>} />
              <Route path="/customer" element={<ProtectedRoute allow="customer"><CustomerPortal /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ShipmentsProvider>
        </WalletProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
