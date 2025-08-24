// src/components/ServiceCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react"; // Keep this if you're mapping string names to icons
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Define an interface for the service object
interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: LucideIcon; // Or string, depending on your implementation
}

// Update the props to accept a single 'service' object
interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { user } = useAuth();
  // Destructure the properties from the service object
  const { id, icon: Icon, name, description, features } = service;

  return (
    <Card className="group hover:shadow-ocean transition-all duration-500 transform hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-ocean rounded-xl shadow-soft group-hover:shadow-glow transition-all duration-300">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">{name}</h3>
        </div>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {(features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        {user ? (
          <Link to={`/book?service=${id}`}>
            <Button 
              variant="default" 
              className="w-full font-semibold"
            >
              Book Now
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button 
              variant="default" 
              className="w-full font-semibold"
            >
              Sign In to Book
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
