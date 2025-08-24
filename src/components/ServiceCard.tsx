// src/components/ServiceCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// This interface now represents a Service Category
interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface ServiceCardProps {
  service: ServiceCategory;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link to={`/service/${service.id}`}>
      <Card className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-ocean transition-all duration-500 hover:scale-[1.02] h-full">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {service.image_url && (
            <img
              src={service.image_url}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{service.name}</h3>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground">{service.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
