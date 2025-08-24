import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Wand2,
  Tag,
  UtensilsCrossed,
  Car,
  Compass,
  Award,
  Plane,
  ShoppingCart,
  Heart,
  Waves,
  ChefHat,
  Camera,
  Fish,
  Sun,
  CalendarHeart,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import ServicesToggleHeader from "@/components/ServicesToggleHeader";
import cantDecideImg from "@/assets/Boca-del-Rio-ariel.jpg";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_group: string;
  tags: string[];
  icon_name: string;
  features?: string[];
  // This will hold the actual icon component
  icon?: React.ElementType; 
}

// Icon map to convert string names from Supabase to Lucide icon components
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

const BookService = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState("Vacation");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("service_categories")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;
        
        // Transform the data here, converting icon_name to an icon component
        const serviceData = (data || []).map(service => ({
          ...service,
          icon: iconMap[service.icon_name as string] || iconMap["default"],
        }));
        
        setServices(serviceData);

        const uniqueTags = new Set<string>();
        serviceData.forEach(service => {
          if (service.tags) {
            service.tags.forEach(tag => uniqueTags.add(tag));
          }
        });
        setAllTags(Array.from(uniqueTags));

      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Could not fetch services.",
          variant: "destructive",
        });
      }
    };

    fetchServices();
  }, [toast]);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.category_group === activeGroup &&
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 || (service.tags && selectedTags.every(tag => service.tags.includes(tag))))
    );
    setFilteredServices(filtered);
  }, [searchTerm, services, activeGroup, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] -mt-16 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cantDecideImg})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-bold">Explore Our Services</h1>
          <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
            From adventure to relaxation, we have everything you need for the perfect Belizean getaway.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <ServicesToggleHeader
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
          />

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services (e.g., 'fishing', 'spa')..."
                className="w-full pl-10 py-6 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-12 flex flex-wrap gap-2 items-center">
             <Tag className="h-5 w-5 text-muted-foreground mr-2"/>
             <span className="font-semibold mr-2">Filter by:</span>
            {allTags.map(tag => (
              <Button 
                key={tag} 
                variant={selectedTags.includes(tag) ? "ocean" : "outline"}
                size="sm"
                onClick={() => handleTagClick(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 border rounded-lg">
              <h2 className="text-2xl font-bold mb-4">No Services Found</h2>
              <p className="text-muted-foreground">
                We couldn't find any services matching your search or filters in the "{activeGroup}" category.
              </p>
            </div>
          )}

          <Card className="mt-16 overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">Can't Decide?</h2>
                <p className="text-muted-foreground mb-6">
                  Let our expert concierge team craft a personalized itinerary just for you. Tell us your interests, and we'll handle the rest!
                </p>
                <Link to="/build-my-trip">
                  <Button variant="ocean" size="lg">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Build My Perfect Trip
                  </Button>
                </Link>
              </div>
              <div className="h-64 md:h-full">
                <img src={cantDecideImg} alt="Beautiful aerial view of San Pedro, Belize" className="w-full h-full object-cover"/>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default BookService;
