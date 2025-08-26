// src/pages/ServiceDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Tables } from '@/integrations/supabase/types';

type ServiceCategory = Tables<'service_categories'>;

interface Vendor {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
}

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceCategory | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-service-vendors', {
          body: { serviceId }
        });

        if (error) throw error;

        setService(data.service);
        setVendors(data.vendors || []);

      } catch (error) {
        console.error('Error fetching service details:', error);
        toast({ title: "Error", description: "Could not load service details.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId, toast]);

  const handleAddToCart = (vendor: Vendor) => {
    if (!service) return;
    addToCart({
      id: `${service.id}-${vendor.id}`,
      name: `${service.name} by ${vendor.name}`,
      description: vendor.description || service.description || '',
      price: vendor.price,
      basePrice: vendor.price,
      image_url: vendor.image_url || service.image_url || '',
    });
    toast({
      title: "Added to Cart!",
      description: `${service.name} from ${vendor.name} has been added.`,
    });
  };

  if (loading) {
    return (
      <>
        {/* Hero Skeleton */}
        <section className="relative h-[50vh] min-h-[400px] -mt-16 flex items-end pb-16">
          <Skeleton className="absolute inset-0" />
          <div className="relative z-10 container mx-auto px-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-16 w-96" />
          </div>
        </section>
        
        {/* Content Skeleton */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-80 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <div className="grid md:grid-cols-3">
                      <Skeleton className="h-48 md:h-full" />
                      <div className="md:col-span-2 p-6">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-10 w-32" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  if (!service) {
    return <div className="container mx-auto px-4 py-24 text-center">Service category not found.</div>;
  }

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] -mt-16 flex items-end pb-16 text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.image_url || '...'})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">{service.category_group}</Badge>
          <h1 className="text-5xl md:text-7xl font-bold">{service.name}</h1>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Services
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Vetted Local Partners</h2>
              <p className="text-lg text-muted-foreground mt-2">{service.description}</p>
            </div>
            
            <div className="space-y-6">
              {vendors.length > 0 ? vendors.map(vendor => (
                <Card key={vendor.id} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                  <div className="grid md:grid-cols-3">
                    <div className="md:col-span-1">
                      <img src={vendor.image_url || service.image_url} alt={vendor.name} className="w-full h-48 md:h-full object-cover" />
                    </div>
                    <div className="md:col-span-2 p-6">
                      <h3 className="text-2xl font-bold">{vendor.name}</h3>
                      <div className="flex items-center my-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-2 text-sm text-muted-foreground">(4.8 stars)</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{vendor.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-2xl font-bold text-primary">${vendor.price.toFixed(2)}</p>
                        <Button onClick={() => handleAddToCart(vendor)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-12 border rounded-lg">
                  <h3 className="text-xl font-semibold">Coming Soon!</h3>
                  <p className="text-muted-foreground mt-2">We are finalizing our partnerships for {service.name}. Please check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
