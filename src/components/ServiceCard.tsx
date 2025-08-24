// src/components/ServiceCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Define an interface for the service object that the card will receive
interface Service {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  features?: string[];
  icon?: LucideIcon; // The icon should be a component
}

// Update the props to accept a single 'service' object
interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Destructure the properties from the service object
  const { id, icon: Icon, name, description, features } = service;

  return (
    <Card className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-ocean transition-all duration-500 hover:scale-[1.02] flex flex-col h-full">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {service.image_url && (
          <img
            src={service.image_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
        </div>
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {(features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <Link to={`/service/${id}`}>
            <Button
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
