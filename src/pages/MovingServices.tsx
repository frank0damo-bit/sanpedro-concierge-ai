import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UtensilsCrossed,
  Car,
  Compass,
  MessageCircle,
  Phone,
  Star,
  Users,
  Award,
  ShieldCheck,
  Heart,
  Camera,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Define an interface for your service objects
interface FeaturedService {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

const Index = () => {
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      const { data, error } = await supabase
        .from("service_categories")
        .select("id, name, description")
        .in("name", [
          "Restaurants",
          "Photography Services",
          "Airport Transfers",
          "Spa & Wellness",
          "Excursions",
          "Golf Cart Rentals",
        ])
        .limit(6);

      if (error) throw error;

      const iconMap: { [key: string]: LucideIcon } = {
        "Restaurants": UtensilsCrossed,
        "Photography Services": Camera,
        "Airport Transfers": Plane,
        "Spa & Wellness": Heart,
        "Excursions": Compass,
        "Golf Cart Rentals": Car,
      };

      const imageMap: { [key: string]: string } = {
        "Restaurants": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
        "Photography Services": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
        "Airport Transfers": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b",
        "Spa & Wellness": "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
        "Excursions": "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        "Golf Cart Rentals": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
      };

      const services = (data || []).map(service => ({
        id: service.id,
        icon: iconMap[service.name] || Award,
        title: service.name,
        description: service.description || "Learn more about this service.",
        image: imageMap[service.name],
      }));

      setFeaturedServices(services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const conciergeTeam = [
    {
      name: "Sofia Martinez",
      role: "Senior Concierge Specialist",
      experience: "8 years in luxury hospitality",
      avatar: "/api/placeholder/150/150",
      specialties: ["Fine Dining", "Cultural Tours", "VIP Services"],
    },
    {
      name: "Carlos Rivera",
      role: "Adventure & Excursions Expert",
      experience: "12 years guiding in Belize",
      avatar: "/api/placeholder/150/150",
      specialties: ["Diving", "Fishing", "Mayan Sites"],
    },
    {
      name: "Isabella Chen",
      role: "Wellness & Lifestyle Curator",
      experience: "6 years in resort management",
      avatar: "/api/placeholder/150/150",
      specialties: ["Spa Services", "Photography", "Events"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah & Mike Johnson",
      location: "Dallas, Texas",
      text: "Sofia and her team made our anniversary trip absolutely magical. From the private beach dinner to the surprise helicopter tour, every detail was perfect.",
      rating: 5,
      service: "Romantic Getaway Package",
    },
    {
      name: "The Thompson Family",
      location: "Vancouver, Canada",
      text: "Carlos arranged the most incredible snorkeling adventure for our kids. They're still talking about swimming with nurse sharks at Hol Chan!",
      rating: 5,
      service: "Family Adventure Tours",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight">
              We curate the best local experiences around your{" "}
              <span className="text-accent-light">Caribbean escape</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Your personal concierge team creates unforgettable moments in San Pedro, Belize
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-service">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-semibold">
                  I'm Traveling
                </Button>
              </Link>
              <Link to="/moving-services">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-lg px-8 py-6 font-semibold text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
                >
                  I'm Moving
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-glow/30 rounded-full blur-2xl animate-pulse"></div>
      </section>
      
      {/* Rest of the component... */}
      <section id="services" className="py-20 bg-accent-light/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Handpicked Experiences
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our most popular services, curated by our team of local experts who know Belize
              inside and out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredServices.map((service) => (
              <Card
                key={service.id}
                className="group overflow-hidden hover:shadow-ocean transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-ocean rounded-lg">
                      <service.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link to={`/service/${service.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button size="lg" variant="ocean" className="text-lg px-8 py-6 font-semibold">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* ... Rest of the component remains the same */}
    </div>
  );
};

export default Index;
