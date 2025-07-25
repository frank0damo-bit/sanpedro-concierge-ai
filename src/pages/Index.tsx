import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Car, 
  Compass, 
  Calendar, 
  Bed, 
  Home,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const services = [
    {
      icon: UtensilsCrossed,
      title: "Restaurant Reservations",
      description: "Secure tables at San Pedro's finest dining establishments, from beachfront bistros to upscale culinary experiences.",
      features: [
        "Priority reservations at top restaurants",
        "Dietary restriction accommodations",
        "Private dining arrangements",
        "Local cuisine recommendations"
      ]
    },
    {
      icon: Car,
      title: "Golf Cart Rentals",
      description: "Navigate San Pedro in style with our premium golf cart rental service, perfect for island exploration.",
      features: [
        "Premium golf cart fleet",
        "GPS navigation included",
        "24/7 roadside assistance",
        "Custom itinerary planning"
      ]
    },
    {
      icon: Compass,
      title: "Excursions & Tours",
      description: "Discover Belize's natural wonders with expertly curated adventures and personalized tour experiences.",
      features: [
        "Snorkeling & diving expeditions",
        "Mayan ruins exploration",
        "Private boat charters",
        "Wildlife sanctuary visits"
      ]
    },
    {
      icon: Calendar,
      title: "Events & Entertainment",
      description: "Access exclusive events, cultural celebrations, and entertainment venues throughout San Pedro.",
      features: [
        "VIP event access",
        "Cultural festival tickets",
        "Nightlife recommendations",
        "Private event planning"
      ]
    },
    {
      icon: Bed,
      title: "Travel Accommodations",
      description: "Premium lodging arrangements from luxury resorts to boutique hotels, tailored to your preferences.",
      features: [
        "Luxury resort bookings",
        "Boutique hotel partnerships",
        "Room upgrade negotiations",
        "Concierge service coordination"
      ]
    },
    {
      icon: Home,
      title: "Airbnb & Vacation Rentals",
      description: "Handpicked vacation rentals and Airbnb properties offering the perfect home away from home experience.",
      features: [
        "Vetted property selection",
        "Meet & greet services",
        "Property management support",
        "Local area orientation"
      ]
    }
  ];

  const handleBookNow = (serviceName: string) => {
    toast({
      title: "Service Request Received",
      description: `Our AI concierge will contact you shortly about ${serviceName.toLowerCase()}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-background to-accent-light/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Premium Concierge Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the best of San Pedro, Belize with our comprehensive concierge services. 
              Our AI-powered assistant is available 24/7 to help you plan the perfect Caribbean getaway.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                onBookNow={() => handleBookNow(service.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 bg-gradient-ocean">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Meet Your AI Concierge
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Powered by Google Gemini, our intelligent assistant understands your preferences 
              and creates personalized recommendations for an unforgettable Belizean experience.
            </p>
            <Button variant="glass" size="lg" className="text-lg px-8 py-6 font-semibold">
              <MessageCircle className="h-5 w-5" />
              Start Chatting Now
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Contact our concierge team today and let us create your perfect San Pedro adventure.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center p-6">
                <div className="p-4 bg-gradient-ocean rounded-xl mb-4 shadow-soft">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">24/7 Hotline</h3>
                <p className="text-muted-foreground">+501 226-CARE</p>
              </div>
              
              <div className="flex flex-col items-center p-6">
                <div className="p-4 bg-gradient-ocean rounded-xl mb-4 shadow-soft">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">hello@caribeconcierge.com</p>
              </div>
              
              <div className="flex flex-col items-center p-6">
                <div className="p-4 bg-gradient-ocean rounded-xl mb-4 shadow-soft">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">San Pedro, Ambergris Caye</p>
              </div>
            </div>
            
            <Button variant="ocean" size="lg" className="text-lg px-8 py-6 font-semibold">
              <MessageCircle className="h-5 w-5" />
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">C</span>
                </div>
                <span className="text-lg font-bold">Caribe Concierge</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Your gateway to luxury experiences in San Pedro, Belize.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Restaurant Reservations</li>
                <li>Golf Cart Rentals</li>
                <li>Tours & Excursions</li>
                <li>Accommodations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>24/7 AI Assistant</li>
                <li>Emergency Hotline</li>
                <li>Guest Services</li>
                <li>Feedback</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Location</h4>
              <p className="text-sm text-primary-foreground/80">
                San Pedro Town<br />
                Ambergris Caye, Belize<br />
                Central America
              </p>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-sm text-primary-foreground/60">
              © 2024 Caribe Concierge. All rights reserved. | Powered by AI Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
