import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Link } from "react-router-dom";

export function FloatingTripButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 rounded-full blur-md -m-2"></div>
        <Link to="/build-my-trip">
          <Button
            size="lg"
            className="relative bg-gradient-ocean text-primary-foreground text-lg px-8 py-6 font-semibold shadow-2xl hover:shadow-glow transform hover:scale-105"
          >
            <Wand2 className="h-5 w-5 mr-3" />
            Build My Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}
