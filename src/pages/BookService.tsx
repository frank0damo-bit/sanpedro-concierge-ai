import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { PaymentButton } from '@/components/PaymentButton';

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .neq('category_group', 'Relocation') // Exclude relocation services
          .order('category_group, name');

        if (error) throw error;
        
        const enrichedServices = (data || []).map(service => ({
          ...service,
          price: Math.floor(Math.random() * 500) + 50,
          image_url: `https://placehold.co/600x400?text=${service.name.replace(/\s/g, "+")}`
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
  }, [toast]);

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
    const group = service.category_group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(service);
    return acc;
  }, {} as Record<string, ServiceCategory[]>);


  if (loadingServices) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-xl">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Travel Services</h1>
          <p className="text-xl text-muted-foreground">Curated experiences for your perfect vacation.</p>
        </div>

        {Object.entries(groupedServices).map(([group, services]) => (
            <div key={group} className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-left">{group}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-card/80 backdrop-blur-sm">
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      <img 
                        src={service.image_url} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-2 text-sm text-muted-foreground">(5.0)</span>
                      </div>

                      <div className="space-y-2">
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
      </div>
    </div>
  );
};

export default BookService;