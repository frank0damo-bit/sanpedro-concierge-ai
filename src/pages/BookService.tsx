// src/pages/BookService.tsx

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Wand2,
  Tag,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard"; // This will be our simplified category card
import ServicesToggleHeader from "@/components/ServicesToggleHeader";
import cantDecideImg from "@/assets/Boca-del-Rio-ariel.jpg";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_group: string;
  tags: string[];
}

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
        
        setServices(data || []);

        const uniqueTags = new Set<string>();
        (data || []).forEach(service => {
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
    const filtered = services.filter((service) => {
      const groupFilter = activeGroup === "Vacation"
        ? service.category_group !== "Relocation"
        : service.category_group === activeGroup;
      
      return (
        groupFilter &&
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 || 
         (service.tags && selectedTags.every(tag => service.tags.includes(tag))))
      );
    });
    setFilteredServices(filtered);
  }, [searchTerm, services, activeGroup, selectedTags]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <section className="relative h-[40vh] min-h-[300px] -mt-16 flex items-center justify-center text-center text-white">
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
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services (e.g., 'fishing', 'spa')..."
              className="w-full pl-10 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                We couldn't find any services matching your search in the "{activeGroup}" category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BookService;
