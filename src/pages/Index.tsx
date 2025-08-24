import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  ShoppingCart,
  Fish,
  Sun,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import sanPedroHero from "@/assets/san-pedro-hero.jpg";
import photographyImg from "@/assets/photography.jpg";
import airportTransferImg from "@/assets/airport-transfer.jpg";
import spaWellnessImg from "@/assets/spa-wellness.jpg";
import privateExcursionsImg from "@/assets/cultural-experience.jpg";
import waterSportsImg from "@/assets/water-sports.jpg";
import privateChefImg from "@/assets/private-chef.jpg";
import eventPlanningImg from "@/assets/event-planning.jpg";
import personalShoppingImg from "@/assets/personal-shopping.jpg";
import fishingCharterImg from "@/assets/fishing-charter.jpg";
import laundryHousekeepingImg from "@/assets/laundry-housekeeping.jpg";
import groceryEssentialsImg from "@/assets/grocery-essentials.jpg";
import medicalEmergencyImg from "@/assets/medical-emergency.jpg";

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
        .select("id, name, description, icon_name")
        .eq('is_active', true)
        .neq('category_group', 'Relocation')
        .limit(12);

      if (error) throw error;

      const iconMap: { [key: string]: React.ElementType } = {
        plane: Plane,
        "shopping-bag": ShoppingCart,
        heart: Heart,
        waves: Waves,
        "chef-hat": ChefHat,
        camera: Camera,
        fish: Fish,
        music: Sun,
        "plus-circle": Award,
        "shopping-cart": ShoppingCart,
        "calendar-heart": CalendarHeart,
        shirt: Award,
        utensils: UtensilsCrossed,
        car: Car,
        compass: Compass,
        default: Award,
      };

      const imageMap: { [key: string]: string } = {
        "Fine Dining Reservations": sanPedroHero,
        Restaurants: sanPedroHero,
        "Professional Photography": photographyImg,
        "Photography Services": photographyImg,
        "VIP Airport Transfers": airportTransferImg,
        "Airport Transfers": airportTransferImg,
        "Spa & Wellness": spaWellnessImg,
        "Private Excursions": privateExcursionsImg,
        Excursions: privateExcursionsImg,
        "Luxury Transportation": airportTransferImg,
        "Water Sports Equipment": waterSportsImg,
        "Private Chef Services": privateChefImg,
        "Event Planning": eventPlanningImg,
        "Personal Shopping": personalShoppingImg,
        "Fishing Charters": fishingCharterImg,
        "Cultural Experiences": privateExcursionsImg,
        "Medical & Emergency": medicalEmergencyImg,
        "Grocery & Essentials": groceryEssentialsImg,
        "Laundry & Housekeeping": laundryHousekeepingImg,
        "Golf Cart Rentals": "https://images.unsplash.com/photo-1589139893118-842263886561",
      };

      const services = (data || []).map(service => ({
        id: service.id,
        icon: iconMap[service.icon_name as string] || iconMap["default"],
        title: service.name,
        description: service.description,
        image: imageMap[service.name] || sanPedroHero,
      }));

      setFeaturedServices(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error fetching services",
        description: "Could not load the featured experiences.",
        variant: "destructive",
      });
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
    <>
      <Hero />

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

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredServices.map((service) => (
                <CarouselItem key={service.id} className="basis-full md:basis-1/3 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-ocean transition-all duration-500 hover:scale-[1.02] flex flex-col h-full">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                              <service.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold">{service.title}</h3>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                        <div className="mt-auto">
                          <Link to={`/service/${service.id}`}>
                            <Button
                              variant="outline"
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button 
                size="lg" 
                className="bg-gradient-ocean text-primary-foreground text-lg px-8 py-6 font-semibold shadow-ocean hover:shadow-glow transform hover:scale-105"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent bg-[length:200%_200%] animate-background-pan overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Your Dedicated Concierge Team
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Meet the local experts and hospitality professionals dedicated to crafting your unforgettable Belizean adventure.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide">
              {conciergeTeam.map((member, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-[360px] bg-white shadow-xl hover:shadow-ocean transition-all duration-300 transform hover:-translate-y-2"
                >
                  <CardContent className="p-6 pt-8 text-center flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-primary/10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-primary/80 mb-4">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {member.specialties.map((specialty, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto w-full">
                      <Link to="/messages">
                        <Button variant="ocean" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat with {member.name.split(' ')[0]}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-accent-light/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              See how travelers turned great stays into extraordinary memories
            </p>

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
    </>
  );
};

export default Index;
