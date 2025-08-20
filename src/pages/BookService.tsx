import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ShoppingCart, Star, ArrowLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { PaymentButton } from '@/components/PaymentButton';
import { Badge } from '@/components/ui/badge';

// Import service images
import airportTransferImg from '@/assets/airport-transfer.jpg';
import personalShoppingImg from '@/assets/personal-shopping.jpg';
import spaWellnessImg from '@/assets/spa-wellness.jpg';
import waterSportsImg from '@/assets/water-sports.jpg';
import privateChefImg from '@/assets/private-chef.jpg';
import photographyImg from '@/assets/photography.jpg';
import fishingCharterImg from '@/assets/fishing-charter.jpg';
import culturalExperienceImg from '@/assets/cultural-experience.jpg';
import medicalEmergencyImg from '@/assets/medical-emergency.jpg';
import groceryEssentialsImg from '@/assets/grocery-essentials.jpg';
import eventPlanningImg from '@/assets/event-planning.jpg';
import laundryHousekeepingImg from '@/assets/laundry-housekeeping.jpg';

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
  const { addToCart } = useCart();
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
      
      // Add enriched data with actual images and pricing
      const serviceImages = {
        'Airport Transfers': airportTransferImg,
        'Personal Shopping': personalShoppingImg, 
        'Spa & Wellness': spaWellnessImg,
        'Water Sports Equipment': waterSportsImg,
        'Private Chef Services': privateChefImg,
        'Photography Services': photographyImg,
        'Fishing Charters': fishingCharterImg,
        'Cultural Experiences': culturalExperienceImg,
        'Medical & Emergency': medicalEmergencyImg,
        'Grocery & Essentials': groceryEssentialsImg,
        'Event Planning': eventPlanningImg,
        'Laundry & Housekeeping': laundryHousekeepingImg
      };
      
      const enrichedServices = (data || []).map(service => ({
        ...service,
        price: Math.floor(Math.random() * 500) + 50, // Random price between $50-$550
        image_url: serviceImages[service.name] || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}`,
        features: ['Professional Service', 'Same Day Booking', '24/7 Support', 'Local Expert Guidance']
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

  // Allow viewing services without authentication
  const requiresAuth = showBookingForm || selectedService;

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

  const handleAddToCart = (service: ServiceCategory) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
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

  // Service detail view - require auth for booking forms
  if (selectedService && showBookingForm) {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAddToCart(selectedService)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <PaymentButton 
                      amount={selectedService.price || 100}
                      description={`${selectedService.name} - Concierge Service`}
                      className="w-full"
                    />
                  </div>
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

  // Service detail view without booking form (no auth required)
  if (selectedService && !showBookingForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedService(null)}
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAddToCart(selectedService)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <PaymentButton 
                      amount={selectedService.price || 100}
                      description={`${selectedService.name} - Concierge Service`}
                      className="w-full"
                    />
                  </div>
                  {user && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowBookingForm(true)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Custom Booking Request
                    </Button>
                  )}
                  {!user && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Sign in for Custom Booking
                    </Button>
                  )}
                </div>
              </div>

              {/* Information Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Service Information</CardTitle>
                    <CardDescription>
                      Everything you need to know about this service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">What's Included:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Professional service delivery</li>
                        <li>• Same-day booking available</li>
                        <li>• 24/7 customer support</li>
                        <li>• Local expert guidance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How it Works:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        <li>1. Book the service</li>
                        <li>2. We'll confirm availability</li>
                        <li>3. Enjoy your experience</li>
                        <li>4. Rate and review</li>
                      </ol>
                    </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-blue-300"></path>
        </svg>
        <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor" className="text-blue-400"></path>
        </svg>
      </div>
      
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Premium Concierge Services</h1>
            <p className="text-xl text-muted-foreground">Choose from our curated selection of luxury services</p>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((service) => (
            <Card key={service.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-card/80 backdrop-blur-sm">
              <div className="aspect-video bg-muted overflow-hidden relative">
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedService(service);
                        setShowBookingForm(false); // Just view details, not booking form
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(service)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
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
    </div>
  );
};

export default BookService;