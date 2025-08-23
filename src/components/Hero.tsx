import { Button } from "@/components/ui/button";
import { MessageCircle, Award, Users, Star } from "lucide-react";
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
        alt="A beautiful view of the San Pedro coast in Belize"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Darkening overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight tracking-tight">
            The Heart of 
            <span className="block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Belize, Unlocked.
            </span>
          </h1>
          
          {/* Icon-based value propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12 text-primary-foreground/90">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <p className="font-semibold">Expertly Curated</p>
              <p className="text-sm text-primary-foreground/70">Vetted tours, dining, and rentals.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <p className="font-semibold">AI-Powered Ease</p>
              <p className="text-sm text-primary-foreground/70">24/7 AI assistant plans every detail.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <p className="font-semibold">Authentic Local Access</p>
              <p className="text-sm text-primary-foreground/70">Unlock exclusive local experiences.</p>
            </div>
          </div>
          
          <div className="flex justify-center">
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
          </div>

        </div>
      </div>
    </section>
  );
}
