import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* This main tag is crucial. It grows to fill all available space. */}
      <main className="flex-grow pt-16">
        <Outlet /> {/* This renders the content of your individual pages */}
      </main>
      <Footer />
    </div>
  );
}
