import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentButtonProps {
  amount: number;
  description: string;
  className?: string;
}

export const PaymentButton = ({ amount, description, className }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async (email?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount,
          description,
          customerEmail: email,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPayment = () => {
    if (!guestEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address for the receipt.",
        variant: "destructive",
      });
      return;
    }
    handlePayment(guestEmail);
  };

  if (!user && !showGuestForm) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            ${amount.toFixed(2)} - {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setShowGuestForm(true)}
            className="w-full"
            variant="outline"
          >
            Continue as Guest
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            or sign in for faster checkout
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user && showGuestForm) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Guest Checkout</CardTitle>
          <CardDescription>
            ${amount.toFixed(2)} - {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email Address</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowGuestForm(false)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleGuestPayment}
              disabled={loading || !guestEmail}
              className="flex-1"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Authenticated user
  return (
    <Button
      onClick={() => handlePayment()}
      disabled={loading}
      className={className}
    >
      {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
    </Button>
  );
};