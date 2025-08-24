import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { BuildMyTripButton } from "./BuildMyTripButton";

export function FloatingTripButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <BuildMyTripButton>
        <Button
          size="lg"
          className="bg-gradient-ocean text-primary-foreground text-lg px-8 py-6 font-semibold shadow-2xl hover:shadow-glow transform hover:scale-105"
        >
          <Wand2 className="h-5 w-5 mr-3" />
          Build My Trip
        </Button>
      </BuildMyTripButton>
    </div>
  );
}
