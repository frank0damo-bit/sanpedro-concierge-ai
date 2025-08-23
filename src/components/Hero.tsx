import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

const heroImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Y2FyaWJiZWFuJTIwYmVhY2h8ZW58MHx8MHx8&auto=format&fit=crop&w=1920&q=80";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-gradient-glass backdrop-blur-sm px-4 py-2 rounded-full border border-border/30">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="text-sm text-foreground/90 font-medium">San Pedro, Belize</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-glass backdrop-blur-sm px-4 py-2 rounded-full border border-border/30">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm text-foreground/90 font-medium">5-Star Service</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Your Luxury
            <span className="text-accent block">Caribbean Experience</span>
            Awaits
          </h1>
          
          <p className="text-xl md:text-2l text-primary-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            From exclusive dining reservations to private excursions, we curate unforgettable experiences 
            in paradise. Let our AI-powered concierge handle every detail of your Belizean adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/messages">
              <Button 
                variant="ocean" 
                size="lg" 
                className="text-lg px-8 py-6 font-semibold"
              >
                <MessageCircle className="h-5 w-5" />
                Chat with AI Concierge
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="glass" size="lg" className="text-lg px-8 py-6 font-semibold">
                Explore Services
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { number: "500+", label: "Happy Guests" },
              { number: "50+", label: "Partner Venues" },
              { number: "24/7", label: "AI Support" },
              { number: "100%", label: "Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{stat.number}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
