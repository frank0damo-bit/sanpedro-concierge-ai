import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ctaImageUrl = "https://images.unsplash.com/photo-1544551763-46a013bb70d5";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  price?: number;
  category_group: string | null;
}

const BookService = () => {
  const { toast } = useToast();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'travel' | 'relocation' | 'essentials'>('all');

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        let query = supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true); // CORRECTED QUERY

        if (activeFilter === 'travel') {
          query = query.eq('category_group', 'Travel');
        } else if (activeFilter === 'relocation') {
          query = query.eq('category_group', 'Relocation');
        } else if (activeFilter === 'essentials') {
          query = query.eq('category_group', 'Essentials');
        }
        
        const { data, error } = await query.order('category_group, name');

        if (error) throw error;
        
        const enrichedServices = (data || []).map(service => ({
          ...service,
          price: Math.floor(Math.random() * 500) + 50,
          image_url: `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop`
        }));
        
        setServiceCategories(enrichedServices);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load services.",
          variant: "destructive",
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [toast, activeFilter]);
  
  const groupedServices = serviceCategories.reduce((acc, service) => {
    const group = service.category_group || 'Other Experiences';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(service);
    return acc;
  }, {} as Record<string, ServiceCategory[]>);


  if (loadingServices) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive range of travel, relocation, and essential services.
            </p>
          </div>

          <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as 'all' | 'travel' | 'relocation' | 'essentials')} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 max-w-2xl mx-auto">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
              <TabsTrigger value="relocation">Relocation</TabsTrigger>
              <TabsTrigger value="essentials">Essentials</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="mt-0">
              {Object.entries(groupedServices).length > 0 ? (
                Object.entries(groupedServices).map(([group, services]) => (
                  <div key={group} className="mb-16">
                    <div className="relative my-12">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-6 text-3xl font-bold text-primary">
                          {group}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {services.map((service) => (
                        <Card key={service.id} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                          <div className="aspect-video bg-muted overflow-hidden relative">
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{service.name}</h3>
                              <div className="text-lg font-semibold text-primary">
                                ${service.price}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 flex-grow line-clamp-2">
                              {service.description}
                            </p>

                            <div className="mt-auto">
                              <Link to={`/service/${service.id}`}>
                                <Button className="w-full" variant="outline">
                                  Learn More
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">No services found for this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="relative py-24 text-white text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ctaImageUrl})` }}
        >
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Can't Decide?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Let our concierge team craft the perfect itinerary just for you.</p>
          <Link to="/messages">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-semibold">
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Planning
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default BookService;
