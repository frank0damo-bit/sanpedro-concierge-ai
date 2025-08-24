import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BuildMyTripButton } from "@/components/BuildMyTripButton";
import { FloatingTripButton } from "@/components/FloatingTripButton";
import { FooterCTA } from "./FooterCTA";
  
export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <FooterCTA />
      <Footer />
      <FloatingTripButton /> {/* Add this line */}
      
    </div>
  );
}
