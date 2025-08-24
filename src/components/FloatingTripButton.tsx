import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wand2 } from "lucide-react";
import { TripBuilderForm } from "./TripBuilderForm";

export function FloatingTripButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-gradient-ocean text-primary-foreground text-lg px-8 py-6 font-semibold shadow-2xl hover:shadow-glow transform hover:scale-105"
        >
          <Wand2 className="h-5 w-5 mr-3" />
          Build My Trip
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Describe Your Perfect Trip</DialogTitle>
            <DialogDescription>
              Provide the details below, and our AI concierge will craft a personalized itinerary just for you.
            </DialogDescription>
          </DialogHeader>
          <TripBuilderForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
