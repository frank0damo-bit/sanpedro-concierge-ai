import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

// This is a mock response structure for demonstration
const mockResponse = {
  title: "Relaxing 7-Day Belizean Bliss",
  totalPrice: 2850,
  savings: 350,
  packageItems: [
    { type: 'Accommodation', name: 'Seaside Cabana at Sunset Point', details: '7 nights, ocean view', price: 1400 },
    { type: 'Excursion', name: 'Hol Chan & Shark Ray Alley Snorkel', details: 'Full day tour with lunch', price: 450 },
    { type: 'Dining', name: 'Dinner Reservation at Blue Water Grill', details: 'Table for 2 with sunset view', price: 200 },
    { type: 'Transport', name: 'Round-trip Golf Cart Rental', details: '7-day rental', price: 300 },
    { type: 'Dining', name: 'Local Food Tasting Tour', details: 'Explore the best local eateries', price: 500 },
  ]
};

export function TripPackagePage() {
  const location = useLocation();
  const { formData } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState<typeof mockResponse | null>(null);

  useEffect(() => {
    // --- THIS IS WHERE YOU WOULD MAKE THE API CALL TO YOUR SUPABASE FUNCTION ---
    // The function would then call OpenAI with the formData.
    // For now, we'll simulate a delay and then show mock data.
    const timer = setTimeout(() => {
      setPackageDetails(mockResponse);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData]);

  if (!formData) {
    return <div className="container mx-auto py-12 text-center">No trip data provided. Please build your trip first.</div>;
  }

  return (
    <div className="-mt-16">
      <section className="bg-primary text-primary-foreground py-24 text-center">
        <div className="container">
          {isLoading ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Crafting Your Perfect Itinerary...</h1>
              <p className="text-xl text-primary-foreground/80">Our AI is curating the best experiences just for you.</p>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mt-8" />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">Your Custom Belize Itinerary is Ready!</h1>
              <p className="text-xl text-primary-foreground/80">Based on your preferences, here is the trip of a lifetime.</p>
            </>
          )}
        </div>
      </section>

      {packageDetails && !isLoading && (
        <section className="py-16">
          <div className="container grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Package Itinerary</h2>
              <div className="space-y-6">
                {packageDetails.packageItems.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <Badge className="mb-2">{item.type}</Badge>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.details}</CardDescription>
                      </div>
                      <div className="text-2xl font-bold text-primary">${item.price}</div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-bold">${packageDetails.totalPrice}</span>
                    </div>
                     <div className="flex justify-between text-lg text-green-600">
                      <span className="text-muted-foreground">Your Savings:</span>
                      <span className="font-bold">${packageDetails.savings}</span>
                    </div>
                    <Button size="lg" className="w-full">
                      <Check className="mr-2 h-5 w-5" />
                      Book This Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
