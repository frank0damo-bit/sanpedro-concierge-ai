import { Button } from "@/components/ui/button";
import { MessageCircle, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImageUrl from "@/assets/san-pedro-hero.jpg";

export function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-center"
    >
      {/* Background Image */}
      <img
        src={heroImageUrl}
        alt="A vibrant waterfront view of colorful buildings and boats in San Pedro, Belize"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Reduced opacity overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-primary-foreground/90 font-medium">
              Trusted by 2,500+ travelers
            </p>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Your Key to the Perfect 
            <span className="block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
              Belizean Adventure
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 mb-10"
            style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.5)' }}
          >
            Unlock exclusive experiences, seamless bookings, and expert local advice with your personal AI-powered concierge for San Pedro.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/messages">
              <Button 
                variant="ocean" 
                size="lg" 
                className="text-lg px-8 py-6 font-semibold shadow-glow hover:shadow-ocean"
              >
                <MessageCircle className="h-5 w-5" />
                Start Planning with AI
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-primary-foreground hover:bg-white/10 hover:text-white"
              >
                Explore Services <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
