import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  onBookNow: () => void;
}

export function ServiceCard({ icon: Icon, title, description, features, onBookNow }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-ocean transition-all duration-500 transform hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-ocean rounded-xl shadow-soft group-hover:shadow-glow transition-all duration-300">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          variant="ocean" 
          className="w-full font-semibold"
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}