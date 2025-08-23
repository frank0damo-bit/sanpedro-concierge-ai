import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, ShieldCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const aboutImageUrl = "https://images.unsplash.com/photo-1528422162028-1f2b38042459"; // A brighter, more inviting image

const team = [
  {
    name: "Sofia Martinez",
    role: "Senior Concierge Specialist",
    avatar: "/api/placeholder/150/150",
    specialties: ["Fine Dining", "Cultural Tours", "VIP Services"],
  },
  {
    name: "Carlos Rivera",
    role: "Adventure & Excursions Expert",
    avatar: "/api/placeholder/150/150",
    specialties: ["Diving", "Fishing", "Mayan Sites"],
  },
  {
    name: "Isabella Chen",
    role: "Wellness & Lifestyle Curator",
    avatar: "/api/placeholder/150/150",
    specialties: ["Spa Services", "Photography", "Events"],
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[450px] flex items-center justify-center text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutImageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-bold">About Caribe Concierge</h1>
            <p className="text-xl md:text-2xl mt-4 max-w-3xl mx-auto">Your Key to Unforgettable Belizean Adventures</p>
          </div>
        </section>

        {/* Our Story & Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">Our Story</h2>
                <p className="text-muted-foreground text-lg">
                  Founded by a team of passionate locals and seasoned travel experts, Caribe Concierge was born from a simple idea: to share the authentic magic of San Pedro with the world. We saw a need for a service that went beyond standard bookings—one that offered a genuine connection to the culture, beauty, and adventure of Belize.
                </p>
                <p className="text-muted-foreground text-lg">
                  Today, we blend cutting-edge AI with our deep-rooted local expertise to provide a seamless, personalized concierge experience unlike any other.
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground text-lg">
                  Our mission is to unlock the heart of Belize for every traveler. We believe that an exceptional vacation is built on seamless experiences, personalized service, and authentic connections. We're dedicated to crafting bespoke itineraries that go beyond the ordinary, creating memories that last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-accent-light/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Why Choose Us?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're more than just a booking service. We're your personal guide to the best of Belize.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft inline-block">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Local Expertise</h3>
                <p className="text-muted-foreground">Our team's deep local knowledge means you get access to hidden gems and authentic experiences that others miss.</p>
              </div>
              <div className="text-center p-6">
                <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft inline-block">
                  <ShieldCheck className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Vetted Quality</h3>
                <p className="text-muted-foreground">Every partner, from tour guides to chefs, is personally vetted to ensure you receive the highest quality service.</p>
              </div>
              <div className="text-center p-6">
                <div className="p-4 bg-primary rounded-xl mb-4 shadow-soft inline-block">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Seamless Technology</h3>
                <p className="text-muted-foreground">Our AI-powered assistant is available 24/7 to help you plan, book, and manage your itinerary with ease.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
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
              {team.map((member, index) => (
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
      </main>
    </div>
  );
};

export default About;
