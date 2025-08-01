import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { PaymentButton } from '@/components/PaymentButton';
import { Badge } from '@/components/ui/badge';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  price?: number;
  image_url?: string;
  features?: string[];
}

const BookService = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Add mock data for demo purposes
      const enrichedServices = (data || []).map(service => ({
        ...service,
        price: Math.floor(Math.random() * 500) + 50, // Random price between $50-$550
        image_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}`,
        features: ['Professional Service', 'Same Day Booking', '24/7 Support']
      }));
      
      setServiceCategories(enrichedServices);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && serviceCategories.length > 0) {
      const service = serviceCategories.find(s => s.id === serviceParam);
      if (service) {
        setSelectedService(service);
        setShowBookingForm(true);
      }
    }
  }, [searchParams, serviceCategories]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_category_id: selectedService.id,
          title: formData.get('title') as string || `${selectedService.name} Booking`,
          description: formData.get('description') as string,
          notes: formData.get('notes') as string,
        });

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "Your booking request has been submitted. Our concierge team will contact you soon.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

  // Service detail view
  if (selectedService && showBookingForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedService(null);
                setShowBookingForm(false);
              }}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Service Details */}
              <div>
                <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                  <img 
                    src={selectedService.image_url} 
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold mb-4">{selectedService.name}</h1>
                <p className="text-muted-foreground mb-6">{selectedService.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ${selectedService.price}
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
                  {selectedService.features?.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <PaymentButton 
                    amount={selectedService.price || 100}
                    description={`${selectedService.name} - Concierge Service`}
                    className="w-full"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Scroll to booking form or show it
                      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Custom Booking Request
                  </Button>
                </div>
              </div>

              {/* Booking Form */}
              <div id="booking-form">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Booking Request</CardTitle>
                    <CardDescription>
                      Need something specific? Tell us your requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Request Title (Optional)</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., Dinner reservation for 4 at Ramon's Village"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Please provide details about what you need..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Any special requests or preferences..."
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Submit Custom Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Service marketplace view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Premium Concierge Services</h1>
          <p className="text-xl text-muted-foreground">Choose from our curated selection of luxury services</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-muted overflow-hidden">
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                    onClick={() => {
                      setSelectedService(service);
                      setShowBookingForm(true);
                    }}
                  >
                    View Details & Book
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

        {serviceCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;