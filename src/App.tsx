import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index"; // CORRECTED
import About from "./pages/About";
import ServicesLanding from "./pages/ServicesLanding";
import BookService from "./pages/BookService";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import MovingServices from "./pages/MovingServices";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancelled } from "./pages/PaymentCancelled";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext"; // CORRECTED
import { CartProvider } from "./contexts/CartContext"; // CORRECTED
import ProtectedRoute from "./components/ProtectedRoute"; // CORRECTED
import { Layout } from "./components/Layout"; // Import the new Layout

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<BookService />} />
              <Route path="/services-landing" element={<ServicesLanding />} />
              <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/moving-services" element={<MovingServices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="staff"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/cancelled" element={<PaymentCancelled />} />
            </Route>
            {/* Routes without Header/Footer */}
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
