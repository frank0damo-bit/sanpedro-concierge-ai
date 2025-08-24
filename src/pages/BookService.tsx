import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Plus, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { PaymentButton } from '@/components/PaymentButton';
import { Link } from 'react-router-dom';


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
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'travel' | 'relocation'>('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true);

        // Apply filter based on activeFilter
        if (activeFilter === 'travel') {
          query = query.neq('category_group', 'Relocation');
        } else if (activeFilter === 'relocation') {
          query = query.eq('category_group', 'Relocation');
        }
        // For 'all', no additional filter needed

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

  const handleAddToCart = (service: ServiceCategory) => {
    addToCart({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price || 100,
      image_url: service.image_url,
    });
    
    toast({
      title: "Added to Cart!",
      description: `${service.name} has been added to your cart.`,
    });
  };
  
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
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-xl">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
        {/* Services List with Filters */}
        <section>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Services
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose from our comprehensive range of travel and relocation services
              </p>
            </div>

            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as 'all' | 'travel' | 'relocation')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 max-w-md mx-auto">
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="travel">Travel Services</TabsTrigger>
                <TabsTrigger value="relocation">Relocation Services</TabsTrigger>
              </TabsList>

              <TabsContent value={activeFilter} className="mt-0">
                {Object.entries(groupedServices).map(([group, services]) => (
                  <div key={group} className="mb-16">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-left">{group}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {services.map((service) => (
                        <Card key={service.id} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                          <div className="aspect-video bg-muted overflow-hidden relative">
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{service.name}</h3>
                              <div className="text-lg font-semibold text-primary">
                                ${service.price}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {service.description}
                            </p>

                            <div className="flex items-center mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">(5.0)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button 
                                className="w-full"
                                onClick={() => handleAddToCart(service)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <PaymentButton 
                                amount={service.price || 100}
                                description={`${service.name} - Concierge Service`}
                                className="w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ctaImageUrl})` }}
          >
            <div className="absolute inset-0 bg-primary/80" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">Can't Decide?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Let our AI assistant craft the perfect itinerary just for you.</p>
            <Link to="/messages">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-semibold">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Planning with AI
              </Button>
            </Link>
          </div>
        </section>
    </>
  );
};

export default BookService;
