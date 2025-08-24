import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sun, Map, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


// New images for a more vibrant and relaxing feel
const aboutHeroUrl = "https://images.unsplash.com/photo-1541599308631-7357604d1a49";
const philosophyImageUrl = "https://images.unsplash.com/photo-1516832677958-6a9a0b182a12";
const ctaImageUrl = "Boca-del-Rio-ariel.jpg";

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
}

const About = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase.from('team_members').select('*');
        if (error) throw error;
        setTeam(data || []);
      } catch (error) {
        console.error("Error fetching team:", error);
        toast({
          title: "Error fetching team data",
          variant: "destructive",
        });
      }
    };
    fetchTeam();
  }, [toast]);


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* New Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutHeroUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="relative z-10 p-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>Welcome to the Easy Life</h1>
            <p className="text-xl md:text-2xl mt-4 max-w-3xl mx-auto" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.3)' }}>This is where your perfect Belize adventure begins.</p>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-primary">Our Philosophy</h2>
                <p className="text-muted-foreground text-lg">
                  Caribe Concierge was born from a love for the turquoise waters, vibrant culture, and endless sunshine of San Pedro. We're a team of locals and travel lovers who believe the best vacations are effortless, authentic, and filled with moments of pure joy.
                </p>
                <p className="text-muted-foreground text-lg">
                  Our mission is simple: to handle all the details so you can focus on what truly matters—making memories. We combine our deep local knowledge with smart, simple technology to craft experiences that feel less planned and more discovered.
                </p>
              </div>
              <div>
                <img src={philosophyImageUrl} alt="Relaxing beach scene in Belize" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="py-24 bg-accent-light/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">What Makes Us Different?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center p-6 space-y-4">
                <div className="p-4 bg-white rounded-full mb-4 shadow-md inline-block">
                  <Heart className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Local Heart</h3>
                <p className="text-muted-foreground">We live here, we love it here, and we know the people and places that make San Pedro special. You get access to experiences curated by true locals.</p>
              </div>
              <div className="text-center p-6 space-y-4">
                <div className="p-4 bg-white rounded-full mb-4 shadow-md inline-block">
                  <Sun className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Seamlessly Smart</h3>
                <p className="text-muted-foreground">Our AI-powered platform makes planning effortless. Get instant recommendations and book your entire trip with a simple chat, anytime, anywhere.</p>
              </div>
              <div className="text-center p-6 space-y-4">
                <div className="p-4 bg-white rounded-full mb-4 shadow-md inline-block">
                  <Map className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Truly Vetted</h3>
                <p className="text-muted-foreground">We only recommend what we love and trust. Every tour, restaurant, and rental is hand-picked and vetted for quality, safety, and fun.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Experts */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Meet the Experts</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The friendly faces behind your perfect vacation.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide">
                {team.map((member, index) => (
                  <Card
                    key={index}
                    className="flex-shrink-0 w-[340px] bg-white shadow-lg border-0 rounded-2xl overflow-hidden group"
                  >
                    <CardContent className="p-6 text-center flex flex-col items-center">
                      <Avatar className="w-28 h-28 mb-4 border-4 border-accent-light/50 transition-all duration-300 group-hover:border-accent">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-2xl font-bold text-foreground">{member.name}</h3>
                      <p className="text-primary/80 mb-4">{member.role}</p>
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {member.specialties.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-accent/10 text-accent-foreground"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-auto w-full">
                          <Button
                              variant="outline"
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              Say Hello
                            </Button>
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
