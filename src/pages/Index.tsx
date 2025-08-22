import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
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
  Waves,
  ChefHat,
  CalendarHeart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Define an interface for your service objects
interface FeaturedService {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
}

const Index = () => {
  const { toast } = useToast();
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
          "Fine Dining Reservations",
          "Professional Photography",
          "VIP Airport Transfers",
          "Spa & Wellness",
          "Private Excursions",
          "Luxury Transportation",
          "Water Sports Equipment",
          "Private Chef Services",
          "Event Planning"
        ])
        .limit(6);

      if (error) throw error;

      const iconMap: { [key: string]: React.ElementType } = {
        "Fine Dining Reservations": UtensilsCrossed,
        "Professional Photography": Camera,
        "VIP Airport Transfers": Plane,
        "Spa & Wellness": Heart,
        "Private Excursions": Compass,
        "Luxury Transportation": Car,
        "Water Sports Equipment": Waves,
        "Private Chef Services": ChefHat,
        "Event Planning": CalendarHeart,
        "Restaurants": UtensilsCrossed,
        "Golf Cart Rentals": Car,
        "Excursions": Compass,
      };

      const imageMap: { [key: string]: string } = {
        "Fine Dining Reservations": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
        "Professional Photography": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
        "VIP Airport Transfers": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b",
        "Spa & Wellness": "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
        "Private Excursions": "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
        "Luxury Transportation": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "Water Sports Equipment": "https://images.unsplash.com/photo-1511222955395-58448a1a3e9c",
        "Private Chef Services": "https://images.unsplash.com/photo-1621996346565-e326b20f545a",
        "Event Planning": "https://images.unsplash.com/photo-1519167758481-939e6573b4b6",
        "Restaurants": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
        "Golf Cart Rentals": "https://images.unsplash.com/photo-1589139893118-842263886561",
        "Excursions": "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      };

      const services = (data || []).map(service => ({
        id: service.id,
        icon: iconMap[service.name] || Award,
        title: service.name,
        description: service.description,
        image: imageMap[service.name] || "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
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

    {/* Hero Section - LocalBird Style */}
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

      {/* Call-to-action buttons */}
      <div className="flex gap-4 justify-center">
        <Link to="/services?filter=travel">
          <Button size="lg" variant="ocean">
            I’m Travelling
          </Button>
        </Link>
        <Link to="/services?filter=moving">
          <Button size="lg" variant="outline-primary">
            Moving
          </Button>
        </Link>
      </div>
    </div>
  </div>

  {/* Floating elements for visual interest */}
  <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
  <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-glow/30 rounded-full blur-2xl animate-pulse"></div>
</section>

      {/* Trust Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Trusted by over 2,500 travelers this year
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Curated Experiences</h3>
              <p className="text-muted-foreground text-sm">
                Hand-picked activities by our local experts
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft">
                <ShieldCheck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Vetted Partners</h3>
              <p className="text-muted-foreground text-sm">
                Every vendor personally verified by our team
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft">
                <MessageCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Personal Concierge</h3>
              <p className="text-muted-foreground text-sm">
                Dedicated team available 24/7 for assistance
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Exclusive Access</h3>
              <p className="text-muted-foreground text-sm">Special rates and priority bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
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
            {featuredServices.map((service, index) => (
              <Card
                key={index}
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
                    <div className="p-2 bg-primary rounded-lg">
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

      {/* Meet Your Concierge Team */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Meet Your Personal Concierge Team
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Our dedicated team of local experts is here to create your perfect Belizean
              experience. Each team member brings years of hospitality expertise and deep local
              knowledge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {conciergeTeam.map((member, index) => (
              <Card
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary-foreground/30">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-foreground/80 mb-2">{member.role}</p>
                  <p className="text-primary-foreground/70 text-sm mb-4">{member.experience}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-primary-foreground/20 text-primary-foreground/90 border-primary-foreground/30"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section id="contact" className="py-20 bg-accent-light/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              See how travelers turned great stays into extraordinary memories
            </p>

            {/* Testimonials moved here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-ocean transition-shadow duration-300 text-left"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </p>
                      </div>
                      <Badge variant="outline">{testimonial.service}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/messages">
                <Button variant="ocean" size="lg" className="text-lg px-8 py-6 font-semibold">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start Planning My Trip
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 font-semibold"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Our Team
              </Button>
            </div>
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
                San Pedro Town
                <br />
                Ambergris Caye, Belize
                <br />
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
