import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Car, Compass, Home, Briefcase, Award, Camera, Plane, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";


// Import images for services
import fineDiningImg from "@/assets/san-pedro-hero.jpg";
import privateExcursionsImg from "@/assets/cultural-experience.jpg";
import luxuryTransportImg from "@/assets/airport-transfer.jpg";
import relocationAssistanceImg from "@/assets/personal-shopping.jpg";
import photographyImg from "@/assets/photography.jpg";
import spaWellnessImg from "@/assets/spa-wellness.jpg";

interface FeaturedService {
  id: string;
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
  category: "travel" | "moving" | "general";
}

export default function ServicesLanding() {
  const location = useLocation();
  const { items, addToCart } = useCart();

  // Check for ?filter=travel or passed state
  const queryParams = new URLSearchParams(location.search);
  const filterFromQuery = queryParams.get("filter") as "all" | "travel" | "moving" | null;

  const [filter, setFilter] = useState<"all" | "travel" | "moving">("all");

  useEffect(() => {
    if (filterFromQuery) {
      setFilter(filterFromQuery);
    }
  }, [filterFromQuery]);

  const services: FeaturedService[] = [
    {
      id: "1",
      image: fineDiningImg,
      icon: UtensilsCrossed,
      title: "Fine Dining",
      description: "Exclusive reservations at San Pedro’s top restaurants.",
      category: "travel",
    },
    {
      id: "2",
      image: privateExcursionsImg,
      icon: Compass,
      title: "Private Excursions",
      description: "Guided tours and cultural experiences tailored for you.",
      category: "travel",
    },
    {
      id: "3",
      image: luxuryTransportImg,
      icon: Car,
      title: "Luxury Transport",
      description: "Airport transfers and luxury car rentals.",
      category: "travel",
    },
    {
      id: "4",
      image: relocationAssistanceImg,
      icon: Home,
      title: "Relocation Assistance",
      description: "Help moving to San Pedro stress-free.",
      category: "moving",
    },
    {
      id: "5",
      image: photographyImg,
      icon: Camera,
      title: "Photography",
      description: "Professional photography sessions.",
      category: "general",
    },
    {
      id: "6",
      image: spaWellnessImg,
      icon: Award,
      title: "Spa & Wellness",
      description: "Relaxation and wellness experiences.",
      category: "general",
    },
  ];

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((service) => service.category === filter);

  const handleAddToCart = (service: FeaturedService) => {
    addToCart({
      id: service.id,
      name: service.title,
      description: service.description,
      price: 100, // Default price
      basePrice: 100, // Default base price
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Filter Buttons */}
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>
        <div className="flex justify-center gap-4 mb-10">
          <Button onClick={() => setFilter("all")} variant={filter === "all" ? "default" : "outline"}>
            All Services
          </Button>
          <Button onClick={() => setFilter("travel")} variant={filter === "travel" ? "default" : "outline"}>
            I’m Travelling
          </Button>
          <Button onClick={() => setFilter("moving")} variant={filter === "moving" ? "default" : "outline"}>
            Moving
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="rounded-2xl shadow-md overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="h-40 w-full object-cover"
              />
              <CardContent className="p-4">
                <service.icon className="h-6 w-6 mb-2 text-gray-600" />
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-gray-500">{service.description}</p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleAddToCart(service)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Cart Counter */}
      {items.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
          🛒 Cart: {items.length}
        </div>
      )}
    </div>
  );
}
