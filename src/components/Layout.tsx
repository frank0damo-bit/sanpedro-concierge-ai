import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import FooterCTA from "@/components/FooterCTA";
import ScrollToTop from "./ScrollToTop";

export function Layout() {
  const location = useLocation();

  // Define paths where FooterCTA should appear
  const showFooterCTAOn = ["/", "/about"];
  const shouldShowFooterCTA = showFooterCTAOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ScrollToTop />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Conditionally render FooterCTA */}
      {shouldShowFooterCTA && <FooterCTA />}

      <Footer />
    </div>
  );
}
