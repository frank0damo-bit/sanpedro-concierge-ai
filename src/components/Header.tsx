import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, Phone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Cart } from "@/components/Cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-glass backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-ocean rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Caribe Concierge</h1>
            <p className="text-xs text-muted-foreground">San Pedro, Belize</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#home" className="text-foreground hover:text-accent transition-colors">Home</Link>     
          <Link to="/book-service" className="text-foreground hover:text-accent transition-colors">Services</Link>          
          <a href="#about" className="text-foreground hover:text-accent transition-colors">About</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="glass" size="sm" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
            Contact Us
          </Button>
          <Button variant="ocean" size="sm">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </Button>
          <Cart />
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm">
                Sign In
              </Button>
            </Link>
          )}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/#home" 
                  className="text-foreground hover:text-accent transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/book-service" 
                  className="text-foreground hover:text-accent transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <a 
                  href="#about" 
                  className="text-foreground hover:text-accent transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
              </nav>
              
              <div className="mt-auto mb-6">
                <Link to="/book-service" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" size="lg">
                    Start Planning My Trip
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}