import { TripBuilderForm } from "@/components/TripBuilderForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import buildTripImageUrl from "@/assets/Boca-del-Rio-ariel.jpg";

export function BuildMyTripPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 -mt-16">
       <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${buildTripImageUrl})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-20 left-4 z-20">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Describe Your Perfect Trip</h1>
              <p className="text-muted-foreground mt-2">
                Provide the details below, and our concierge will craft a personalized itinerary just for you.
              </p>
            </div>
            <TripBuilderForm onClose={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
