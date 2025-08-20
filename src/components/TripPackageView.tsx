import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, DollarSign, ArrowLeft, ShoppingCart } from 'lucide-react';
import { PaymentButton } from '@/components/PaymentButton';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface TripPackageItem {
  id: string;
  service_category_id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

interface TripPackage {
  id: string;
  title: string;
  description: string;
  party_size: number;
  travel_dates?: {
    checkIn: string;
    checkOut: string;
  };
  total_price: number;
  status: string;
  created_at: string;
}

interface TripPackageViewProps {
  package: TripPackage;
  items: TripPackageItem[];
  onBack: () => void;
}

export const TripPackageView: React.FC<TripPackageViewProps> = ({
  package: tripPackage,
  items,
  onBack
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.service_category_id,
          name: item.title,
          description: item.description,
          price: item.unit_price,
        });
      }
    });

    toast({
      title: "Package Added to Cart!",
      description: `All ${items.length} services from your trip package have been added to your cart.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trip Builder
        </Button>
        <Badge variant={tripPackage.status === 'draft' ? 'secondary' : 'default'}>
          {tripPackage.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-start gap-3">
            <MapPin className="w-6 h-6 text-primary mt-1" />
            {tripPackage.title}
          </CardTitle>
          <CardDescription className="text-base">
            {tripPackage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{tripPackage.party_size} {tripPackage.party_size === 1 ? 'person' : 'people'}</span>
            </div>
            {tripPackage.travel_dates && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(tripPackage.travel_dates.checkIn)} - {formatDate(tripPackage.travel_dates.checkOut)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">${tripPackage.total_price.toFixed(2)} total</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add Package to Cart
            </Button>
            <PaymentButton 
              amount={tripPackage.total_price}
              description={`${tripPackage.title} - Complete Trip Package`}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Package Includes</h3>
        {items.map((item, index) => (
          <Card key={item.id || index}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${item.total_price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    ${item.unit_price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
              </div>
            </CardHeader>
            {item.notes && (
              <CardContent className="pt-0">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-lg">Total Package Price</h4>
              <p className="text-sm text-muted-foreground">
                For {tripPackage.party_size} {tripPackage.party_size === 1 ? 'person' : 'people'}
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">
              ${tripPackage.total_price.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};