import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, Phone } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-glass backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-ocean rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Caribe Concierge</h1>
            <p className="text-xs text-muted-foreground">San Pedro, Belize</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-foreground hover:text-accent transition-colors">Services</a>
          <a href="#about" className="text-foreground hover:text-accent transition-colors">About</a>
          <a href="#contact" className="text-foreground hover:text-accent transition-colors">Contact</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="glass" size="sm" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
            Call Us
          </Button>
          <Button variant="ocean" size="sm">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}