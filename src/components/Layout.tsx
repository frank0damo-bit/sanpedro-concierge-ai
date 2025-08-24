import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLocation } from "react-router-dom";
import FloatingTripButton from "@/components/FloatingTripButton";
import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  UtensilsCrossed,
  Car,
  Compass,
  MessageCircle,
  Phone,
  Star,
  Users,
  Award,
  ShieldCheck,
  Heart,
  Camera,
  Plane,
  Waves,
  ChefHat,
  CalendarHeart,
  ShoppingCart,
  Fish,
  Sun,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import sanPedroHero from "@/assets/san-pedro-hero.jpg";
import photographyImg from "@/assets/photography.jpg";
import airportTransferImg from "@/assets/airport-transfer.jpg";
import spaWellnessImg from "@/assets/spa-wellness.jpg";
import privateExcursionsImg from "@/assets/cultural-experience.jpg";
import waterSportsImg from "@/assets/water-sports.jpg";
import privateChefImg from "@/assets/private-chef.jpg";
import eventPlanningImg from "@/assets/event-planning.jpg";
import personalShoppingImg from "@/assets/personal-shopping.jpg";
import fishingCharterImg from "@/assets/fishing-charter.jpg";
import laundryHousekeepingImg from "@/assets/laundry-housekeeping.jpg";
import groceryEssentialsImg from "@/assets/grocery-essentials.jpg";
import medicalEmergencyImg from "@/assets/medical-emergency.jpg";
import BuildMyTripButton from "@/components/BuildMyTripButton";
import FooterCTA from "@/components/FooterCTA";

const location = useLocation();

  
export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <FooterCTA />
      <Footer />
      <FloatingTripButton /> {/* Add this line */}
      
    </div>
  );
}
