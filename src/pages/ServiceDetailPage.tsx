// src/pages/ServiceDetailPage.tsx

import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowLeft, Plus, Minus, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type ServiceCategory = Tables<'service_categories'> & {
  booking_fields?: BookingField[];
};

type ServiceOption = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

interface BookingField {
  name: string;
  label: string;
  type: 'quantity' | 'date' | 'textarea' | 'text';
  defaultValue?: any;
  placeholder?: string;
}

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceCategory | null>(null);
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [bookingDetails, setBookingDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceAndOptions = async () => {
      if (!serviceId) return;
      setLoading(true);
      try {
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_categories')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;

        const { data: optionsData, error: optionsError } = await supabase
          .from('service_options')
          .select('id, name, description, price')
          .eq('service_category_id', serviceId);

        if (optionsError) throw optionsError;

        setService(serviceData);
        setOptions(optionsData as ServiceOption[]);
        
        // Initialize booking details state from booking_fields
        if (serviceData.booking_fields) {
          const initialDetails: Record<string, any> = {};
          serviceData.booking_fields.forEach(field => {
            initialDetails[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
          });
          setBookingDetails(initialDetails);
        }

      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndOptions();
  }, [serviceId]);
  
  const handleDetailChange = (name: string, value: any) => {
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = new Set(prev);
      newSelection.has(optionId) ? newSelection.delete(optionId) : newSelection.add(optionId);
      return newSelection;
    });
  };
  
  const totalPrice = useMemo(() => {
    const basePrice = service?.price || 0;
    const quantity = bookingDetails.quantity || bookingDetails.days || bookingDetails.guests || 1;
    const optionsPrice = options
      .filter(option => selectedOptions.has(option.id))
      .reduce((sum, option) => sum + option.price, 0);
    return (basePrice + optionsPrice) * quantity;
  }, [service, options, selectedOptions, bookingDetails]);

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
      // Add the new booking details to the cart item
      bookingDetails: bookingDetails,
    });

    toast({
      title: "Service Added to Cart!",
      description: `${service.name} has been added with your customizations.`,
    });
  };

  const renderBookingField = (field: BookingField) => {
    switch (field.type) {
      case 'quantity':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => handleDetailChange(field.name, Math.max(1, (bookingDetails[field.name] || 1) - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input id={field.name} type="number" value={bookingDetails[field.name] || 1} onChange={(e) => handleDetailChange(field.name, parseInt(e.target.value, 10))} className="w-16 text-center" />
              <Button type="button" variant="outline" size="icon" onClick={() => handleDetailChange(field.name, (bookingDetails[field.name] || 1) + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bookingDetails[field.name] && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingDetails[field.name] ? format(bookingDetails[field.name], "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={bookingDetails[field.name]} onSelect={(date) => handleDetailChange(field.name, date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        );
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea id={field.name} placeholder={field.placeholder} value={bookingDetails[field.name]} onChange={(e) => handleDetailChange(field.name, e.target.value)} />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-24 text-center">Loading service details...</div>;
  if (!service) return <div className="container mx-auto px-4 py-24 text-center">Service not found.</div>;
  
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
              <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all services
              </Button>
              <h2 className="text-3xl font-bold mb-4">About This Service</h2>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">{service.description}</p>
              
              {service.features && service.features.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">What's Included</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>
              )}
              
              {/* Dynamic Booking Fields */}
              {service.booking_fields && (
                <div className="mt-12 space-y-6">
                   <h3 className="text-2xl font-bold">Booking Details</h3>
                  {service.booking_fields.map(renderBookingField)}
                </div>
              )}

              {options.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Customize Your Experience</h3>
                  <div className="space-y-4">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:border-primary transition-colors">
                        <Checkbox id={option.id} onCheckedChange={() => handleOptionChange(option.id)} />
                        <Label htmlFor={option.id} className="flex-grow text-lg cursor-pointer">
                          {option.name}
                          {option.description && <p className="text-sm text-muted-foreground font-normal">{option.description}</p>}
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
                <h3 className="text-2xl font-bold mb-2">Booking Summary</h3>
                <p className="text-muted-foreground mb-6">Review your selections for <span className="font-semibold text-primary">{service.name}</span>.</p>

                <div className="space-y-2 mb-6 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{service.name} (Base)</span>
                    <span>${(service.price || 0).toFixed(2)}</span>
                  </div>
                  {options.filter(o => selectedOptions.has(o.id)).map(o => (
                    <div key={o.id} className="flex justify-between">
                      <span>{o.name}</span>
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
                    Add to Cart - ${totalPrice.toFixed(2)}
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
