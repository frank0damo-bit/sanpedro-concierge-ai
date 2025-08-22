import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const aboutImageUrl = "https://images.unsplash.com/photo-1519452575417-5e0444221425";
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
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutImageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold">About Caribe Concierge</h1>
            <p className="text-xl md:text-2xl mt-4">Your Key to Unforgettable Belizean Adventures</p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                At Caribe Concierge, our mission is to unlock the magic of San Pedro, Belize for every traveler. We believe that a truly exceptional vacation is built on seamless experiences, personalized service, and authentic local connections. By blending cutting-edge AI with the warmth of human expertise, we craft bespoke itineraries that go beyond the ordinary, creating memories that last a lifetime.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 bg-accent-light/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Meet the Heart of Our Service</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our team is a passionate group of local experts and hospitality professionals dedicated to making your Belizean dream a reality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {team.map((member, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-ocean text-primary-foreground">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-primary/80 mb-4">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
