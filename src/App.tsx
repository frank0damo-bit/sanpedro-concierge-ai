import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About"; // Import the new About component
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import BookService from "./pages/BookService";
import ContactSupport from "./pages/ContactSupport";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/AdminDashboard";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancelled } from "./pages/PaymentCancelled";
import NotFound from "./pages/NotFound";
import ServicesLanding from "./pages/ServicesLanding";
import MovingServices from "./pages/MovingServices";
import ServiceDetailPage from "./pages/ServiceDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} /> {/* Add the about route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<ServicesLanding />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/moving-services" element={<MovingServices />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
