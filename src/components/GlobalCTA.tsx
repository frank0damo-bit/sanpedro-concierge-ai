import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Cart } from '@/components/Cart';
import { TripBuilder } from '@/components/TripBuilder';
import { TripPackageView } from '@/components/TripPackageView';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const GlobalCTA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTripBuilder, setShowTripBuilder] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<any>(null);

  // Don't show CTA on auth pages or payment pages
  const hiddenRoutes = ['/auth', '/payment-success', '/payment-cancelled'];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) {
    return null;
  }

  const handlePackageGenerated = (packageData: any) => {
    setGeneratedPackage(packageData);
    setShowTripBuilder(false);
  };

  const handleBackToTripBuilder = () => {
    setGeneratedPackage(null);
    setShowTripBuilder(true);
  };

  return (
    <>
      {/* Desktop CTA */}
      <div className="hidden md:block fixed bottom-4 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur border rounded-xl shadow-lg p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Ready to plan your Belize trip? Let our AI help you create the perfect itinerary.
            </span>
            <div className="flex gap-2">
              <Button
                variant="ocean"
                onClick={() => setShowTripBuilder(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Build Custom Trip with AI
              </Button>
              <Cart />
            </div>
          </div>
        </div>
      </div>

      {/* Trip Builder Dialog */}
      <Dialog open={showTripBuilder} onOpenChange={setShowTripBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <TripBuilder onPackageGenerated={handlePackageGenerated} />
        </DialogContent>
      </Dialog>

      {/* Trip Package Dialog */}
      <Dialog open={!!generatedPackage} onOpenChange={() => setGeneratedPackage(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {generatedPackage && (
            <TripPackageView
              package={generatedPackage.package}
              items={generatedPackage.items}
              onBack={handleBackToTripBuilder}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};