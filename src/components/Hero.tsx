import { Button } from "@/components/ui/button";
import { Award, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImageUrl from "@/assets/san-pedro-hero.jpg";

export function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden text-left"
    >
      {/* Background Image */}
      <img
        src={heroImageUrl}
        alt="A vibrant waterfront view of colorful buildings and boats in San Pedro, Belize"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-xl">
          
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}
          >
            The Heart of Belize, 
            <span className="block text-accent-light">
              Unlocked.
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl max-w-2xl text-white/90 mb-10"
            style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.3)' }}
          >
            Your personal concierge for exclusive experiences, seamless bookings, and expert local advice in San Pedro.
          </p>

          {/* Icon-based value propositions */}
          <div className="space-y-6 text-white mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Award className="h-6 w-6 text-accent-light" />
              </div>
              <div>
                <p className="font-semibold">Expertly Curated</p>
                <p className="text-sm text-white/80">Vetted tours, dining, and rentals.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <ShieldCheck className="h-6 w-6 text-accent-light" />
              </div>
              <div>
                <p className="font-semibold">AI-Powered Ease</p>
                <p className="text-sm text-white/80">24/7 Our trusted concierge plans every detail.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Users className="h-6 w-6 text-accent-light" />
              </div>
              <div>
                <p className="font-semibold">Authentic Local Access</p>
                <p className="text-sm text-white/80">Unlock exclusive local experiences.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/services">
              <Button 
                variant="ocean" 
                size="lg" 
                className="text-lg px-8 py-6 font-semibold shadow-glow hover:shadow-ocean"
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
