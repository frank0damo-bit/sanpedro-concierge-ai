import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, ArrowLeft, Plus } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Tables } from '@/integrations/supabase/types';

type ServiceCategory = Tables<'service_categories'>;
// We need to define the type for our new table
type ServiceOption = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [service, setService] = useState<ServiceCategory | null>(null);
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceAndOptions = async () => {
      if (!serviceId) return;
      setLoading(true);
      try {
        // Fetch service details
        const servicePromise = supabase
          .from('service_categories')
          .select('*')
          .eq('id', serviceId)
          .single();

        // Fetch service options
        const optionsPromise = supabase
          .from('service_options')
          .select('id, name, description, price')
          .eq('service_category_id', serviceId);

        const [{ data: serviceData, error: serviceError }, { data: optionsData, error: optionsError }] = await Promise.all([servicePromise, optionsPromise]);

        if (serviceError) throw serviceError;
        if (optionsError) throw optionsError;

        setService(serviceData);
        setOptions(optionsData as ServiceOption[]);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndOptions();
  }, [serviceId]);

  const handleOptionChange = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(optionId)) {
        newSelection.delete(optionId);
      } else {
        newSelection.add(optionId);
      }
      return newSelection;
    });
  };
  
  const totalPrice = useMemo(() => {
    const basePrice = service?.price || 0;
    const optionsPrice = options
      .filter(option => selectedOptions.has(option.id))
      .reduce((sum, option) => sum + option.price, 0);
    return basePrice + optionsPrice;
  }, [service, options, selectedOptions]);

  const handleAddToCart = () => {
    if (!service) return;

    const selectedOptionsDetails = options
      .filter(option => selectedOptions.has(option.id))
      .map(opt => ({ name: opt.name, price: opt.price }));

    addToCart({
      id: service.id,
      name: service.name,
      description: service.description || '',
      price: totalPrice,
      basePrice: service.price || 0,
      image_url: service.image_url || '',
      options: selectedOptionsDetails,
    });

    toast({
      title: "Service Added to Cart!",
      description: `${service.name} has been added with your customizations.`,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center">Loading service details...</div>;
  }
  if (!service) {
    return <div className="container mx-auto px-4 py-24 text-center">Service not found.</div>;
  }
  
  const features = service.features || [];

  return (
    <>
      <section className="relative h-[60vh] min-h-[500px] -mt-16 flex items-end pb-16 text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.image_url || '...'})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">{service.category_group || 'Experience'}</Badge>
          <h1 className="text-5xl md:text-7xl font-bold">{service.name}</h1>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">About This Service</h2>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">{service.description}</p>
              
              {options.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Customize Your Experience</h3>
                  <div className="space-y-4">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <Checkbox id={option.id} onCheckedChange={() => handleOptionChange(option.id)} />
                        <Label htmlFor={option.id} className="flex-grow text-lg">
                          {option.name}
                          {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                        </Label>
                        <span className="font-semibold text-lg">+${option.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border rounded-2xl shadow-lg bg-card">
                <h3 className="text-2xl font-bold mb-2">Your Package</h3>
                <p className="text-muted-foreground mb-6">Review your selections below.</p>

                <div className="space-y-2 mb-6 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${(service.price || 0).toFixed(2)}</span>
                  </div>
                  {options.filter(o => selectedOptions.has(o.id)).map(o => (
                    <div key={o.id} className="flex justify-between">
                      <span>{o.name}:</span>
                      <span>+${o.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Link to="/messages" className="w-full">
                    <Button size="lg" className="w-full" variant="outline">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat with a Concierge
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
