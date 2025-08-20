import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TripBuilderProps {
  onPackageGenerated?: (packageData: any) => void;
}

export const TripBuilder: React.FC<TripBuilderProps> = ({ onPackageGenerated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    partySize: 2,
    checkIn: '',
    checkOut: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the Trip Builder",
        variant: "destructive",
      });
      return;
    }

    if (!formData.prompt.trim()) {
      toast({
        title: "Trip Description Required",
        description: "Please describe what kind of trip you're looking for",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const travelDates = formData.checkIn && formData.checkOut 
        ? { checkIn: formData.checkIn, checkOut: formData.checkOut }
        : null;

      const { data, error } = await supabase.functions.invoke('generate-trip-package', {
        body: {
          prompt: formData.prompt,
          partySize: formData.partySize,
          travelDates
        }
      });

      if (error) throw error;

      toast({
        title: "Trip Package Generated!",
        description: "Your personalized trip package has been created successfully.",
      });

      if (onPackageGenerated) {
        onPackageGenerated(data);
      }

    } catch (error: any) {
      console.error('Error generating trip package:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate trip package. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">AI Trip Builder</CardTitle>
        <CardDescription>
          Tell us about your dream trip to Belize and we'll create a personalized package just for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateTrip} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="trip-description">Describe Your Perfect Trip</Label>
            <Textarea
              id="trip-description"
              placeholder="I want a romantic getaway with beach activities, spa treatments, and local cultural experiences for 3 days..."
              value={formData.prompt}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-sm text-muted-foreground">
              Include activities, preferences, budget range, or any special requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="party-size" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Party Size
              </Label>
              <Input
                id="party-size"
                type="number"
                min="1"
                max="20"
                value={formData.partySize}
                onChange={(e) => handleInputChange('partySize', parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Travel Dates (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="Check-in"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Check-out"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Your Trip...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Trip Package
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Our AI will analyze your preferences and create a custom itinerary with recommended services and pricing.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};