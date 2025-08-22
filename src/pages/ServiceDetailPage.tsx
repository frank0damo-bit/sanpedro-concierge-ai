import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, Plus, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { PaymentButton } from '@/components/PaymentButton';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  price?: number;
  image_url?: string;
  features?: string[];
}

const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [service, setService] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) throw error;

        // In a real app, you would fetch enriched data, here we'll simulate it
        const enrichedService = {
          ...data,
          price: Math.floor(Math.random() * 500) + 50,
          image_url: `https://placehold.co/600x400?text=${data.name.replace(/\s/g, "+")}`,
          features: ['Professional Service', 'Same Day Booking', '24/7 Support', 'Local Expert Guidance']
        };

        setService(enrichedService);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load service details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, toast]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-xl">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Link to="/services">
            <Button variant="link">Back to services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-primary">
                  ${service.price}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-2 text-sm text-muted-foreground">(5.0)</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-semibold">Features:</h3>
                {service.features?.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
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
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Book This Service</CardTitle>
                <CardDescription>
                  Our team will get in touch to finalize the details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To book this service, please add it to your cart and proceed to checkout, or contact our team for a custom request.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
