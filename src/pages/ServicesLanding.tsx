import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Import images for featured services
import fineDiningImg from "@/assets/san-pedro-hero.jpg";
import privateExcursionsImg from "@/assets/cultural-experience.jpg";
import luxuryTransportImg from "@/assets/airport-transfer.jpg";
import longTermRentalsImg from "@/assets/laundry-housekeeping.jpg";
import relocationAssistanceImg from "@/assets/personal-shopping.jpg";

const featuredServices = [
  {
    image: fineDiningImg,
    title: "Fine Dining Reservations",
    description: "Exclusive access to San Pedro's most sought-after restaurants.",
    link: "/book-service",
  },
  {
    image: privateExcursionsImg,
    title: "Private Excursions",
    description: "Customized adventures to hidden gems only locals know.",
    link: "/book-service",
  },
  {
    image: luxuryTransportImg,
    title: "Luxury Transportation",
    description: "Premium golf carts and private transfers around the island.",
    link: "/book-service",
  },
  {
    image: longTermRentalsImg,
    title: "Long-Term Rentals",
    description: "Find the perfect long-term home in San Pedro.",
    link: "/moving-services",
  },
  {
    image: relocationAssistanceImg,
    title: "Relocation Assistance",
    description: "Comprehensive support for your move to paradise.",
    link: "/moving-services",
  },
];

const ServicesLanding = () => {
  const [userType, setUserType] = useState<"travelling" | "moving">("travelling");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary to-accent text-center text-primary-foreground">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Whether you're visiting for a week or moving for a lifetime, we have services tailored to your needs.
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <Link to="/book-service">
              <Button size="lg" variant={userType === "travelling" ? "secondary" : "ghost"} onClick={() => setUserType("travelling")} className="text-lg px-8 py-6 font-semibold">
                I'm Travelling
              </Button>
            </Link>
            <Link to="/moving-services">
              <Button size="lg" variant={userType === "moving" ? "secondary" : "ghost"} onClick={() => setUserType("moving")} className="text-lg px-8 py-6 font-semibold">
                I'm Moving
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
            {featuredServices.map((service, index) => (
              <Link to={service.link} key={index}>
                <Card className="group overflow-hidden hover:shadow-ocean transition-all duration-500 hover:scale-[1.02]">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesLanding;