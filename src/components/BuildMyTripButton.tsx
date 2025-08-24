import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TripBuilderForm } from "./TripBuilderForm";

interface BuildMyTripButtonProps {
  children: React.ReactNode;
}

export default function BuildMyTripButton({ children }: { children: React.ReactNode }) {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
  );
}
