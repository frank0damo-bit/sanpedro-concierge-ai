import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TripBuilderFormProps {
  onClose: () => void;
}

export function TripBuilderForm({ onClose }: TripBuilderFormProps) {
  const [travelers, setTravelers] = useState(2);
  const [dates, setDates] = useState<{from?: Date; to?: Date}>({});
  const [budget, setBudget] = useState([2500]);
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your ideal trip.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Format the data for the AI call
    const formData = {
      description: prompt,
      travelers,
      dates,
      budget: budget[0],
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the trip package page with the form data
      navigate('/trip-package', { state: { formData } });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="trip-description">Describe your ideal trip</Label>
        <Textarea
          id="trip-description"
          placeholder="I want a relaxing beach vacation in Belize with snorkeling, local food experiences, and cultural activities..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div>
        <Label>Number of travelers</Label>
        <div className="flex items-center gap-4 mt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setTravelers(Math.max(1, travelers - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-8 text-center">{travelers}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setTravelers(travelers + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Travel dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !dates.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates.from ? (
                dates.to ? (
                  `${format(dates.from, "LLL dd, y")} - ${format(dates.to, "LLL dd, y")}`
                ) : (
                  format(dates.from, "LLL dd, y")
                )
              ) : (
                "Pick your travel dates"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dates.from}
              selected={{
                from: dates.from,
                to: dates.to,
              }}
              onSelect={(range) => setDates(range || {})}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Budget range: ${budget[0]}</Label>
        <Slider
          value={budget}
          onValueChange={setBudget}
          max={10000}
          min={500}
          step={250}
          className="mt-2"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating your trip..." : "Create My Trip"}
      </Button>
    </form>
  );
}