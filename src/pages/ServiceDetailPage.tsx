import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ServiceCategory = Tables<'service_categories'>;

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
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
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-xl">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the service you're looking for.</p>
        <Link to="/services">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Services
          </Button>
        </Link>
      </div>
    );
  }
  
  const features = service.features || ['Personalized Itineraries', '24/7 Support', 'Vetted Local Partners', 'Exclusive Access'];

  return (
    <>
      <section className="relative h-[60vh] min-h-[500px] -mt-16 flex items-end pb-16 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image_url || 'https://images.unsplash.com/photo-1541599308631-7357604d1a49'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">{service.category_group || 'Experience'}</Badge>
          <h1 className="text-5xl md:text-7xl font-bold" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}>
            {service.name}
          </h1>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">About This Service</h2>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                {service.description}
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border rounded-2xl shadow-lg bg-card">
                <h3 className="text-2xl font-bold mb-6">Service Features</h3>
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-3" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/messages" className="w-full">
                  <Button size="lg" className="w-full" variant="ocean">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with a Concierge
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
