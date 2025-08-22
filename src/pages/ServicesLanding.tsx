import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Car, Compass, Home, Briefcase, Award, Camera, Plane, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ServicesToggleHeader from "@/components/ServicesToggleHeader";

// Import images for featured services
import fineDiningImg from "@/assets/san-pedro-hero.jpg";
import privateExcursionsImg from "@/assets/cultural-experience.jpg";
import luxuryTransportImg from "@/assets/airport-transfer.jpg";
import longTermRentalsImg from "@/assets/laundry-housekeeping.jpg";
import relocationAssistanceImg from "@/assets/personal-shopping.jpg";
import photographyImg from "@/assets/photography.jpg";
import spaWellnessImg from "@/assets/spa-wellness.jpg";

interface FeaturedService {
  id: string;
  image: string;
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const ServicesLanding = () => {
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("id, name, description, category_group")
        .in("name", [
          "Restaurants",
          "Excursions",
          "Golf Cart Rentals",
          "Long-Term Rentals",
          "Residency Assistance",
          "Photography Services",
          "Spa & Wellness",
        ]);

      if (error) {
        console.error("Error fetching featured services:", error);
        return;
      }

      const iconMap: { [key: string]: React.ElementType } = {
        "Restaurants": UtensilsCrossed,
        "Excursions": Compass,
        "Golf Cart Rentals": Car,
        "Long-Term Rentals": Home,
        "Residency Assistance": Briefcase,
        "Photography Services": Camera,
        "Spa & Wellness": Heart,
      };

      const imageMap: { [key: string]: string } = {
        "Restaurants": fineDiningImg,
        "Excursions": privateExcursionsImg,
        "Golf Cart Rentals": luxuryTransportImg,
        "Long-Term Rentals": longTermRentalsImg,
        "Residency Assistance": relocationAssistanceImg,
        "Photography Services": photographyImg,
        "Spa & Wellness": spaWellnessImg,
      };
      
      const services = data.map(service => ({
        id: service.id,
        image: imageMap[service.name] || '',
        icon: iconMap[service.name] || Award,
        title: service.name,
        description: service.description || '',
        link: service.category_group === 'Relocation' ? `/moving-services` : `/service/${service.id}`,
      }));

      setFeaturedServices(services);
    };

    fetchFeaturedServices();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ServicesToggleHeader />
      <section className="py-20 bg-accent-light/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Featured Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our most popular services, curated by our team of local experts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Link to={service.link}>
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
        </div>
      </section>
    </div>
  );
};

export default ServicesLanding;
