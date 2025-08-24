import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
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
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { CartPage } from "./pages/CartPage";
import { BuildMyTripPage } from "./pages/BuildMyTripPage";
import { TripPackagePage } from "./pages/TripPackagePage";
import ContactSupport from "./pages/ContactSupport";
import ScrollToTop from "./components/ScrollToTop"; // Import the new component

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Router>
          <ScrollToTop /> {/* Add the component here */}
          <Routes>
            {/* Routes with the main layout (Header, Footer, etc.) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<BookService />} />
              <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/moving-services" element={<MovingServices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<ContactSupport />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/build-my-trip" element={<BuildMyTripPage />} />
              <Route path="/trip-package" element={<TripPackagePage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="staff"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            </Route>
            
            {/* Standalone Routes (no main layout) */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
