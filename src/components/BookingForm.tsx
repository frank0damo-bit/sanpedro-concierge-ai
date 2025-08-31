import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Vendor {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface BookingFormProps {
  vendor: Vendor;
  service: ServiceCategory;
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
}

export const BookingForm = ({ vendor, service, onSubmit, onCancel }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    guests: '1',
    time: '',
    specialRequests: '',
  });

  const handleInputChange = (field: string, value: string) => {
    // Input validation and sanitization
    let sanitizedValue = value;
    
    if (field === 'customerName' && value.length > 100) {
      sanitizedValue = value.slice(0, 100);
    }
    
    if (field === 'specialRequests' && value.length > 1000) {
      sanitizedValue = value.slice(0, 1000);
    }
    
    if (field === 'phone') {
      // Allow only numbers, spaces, dashes, parentheses, and plus sign
      sanitizedValue = value.replace(/[^0-9\s\-\(\)\+]/g, '');
      if (sanitizedValue.length > 20) {
        sanitizedValue = sanitizedValue.slice(0, 20);
      }
    }
    
    if (field === 'email' && value.length > 254) {
      sanitizedValue = value.slice(0, 254);
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!date) return false;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    
    // Phone validation (if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const bookingData = {
      ...formData,
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialRequests: formData.specialRequests.trim(),
      date,
      vendor,
      service,
      totalPrice: vendor.price * parseInt(formData.guests),
    };
    
    onSubmit(bookingData);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-center border-b pb-4">
        <h3 className="text-lg font-semibold">Book with {vendor.name}</h3>
        <p className="text-sm text-muted-foreground">{service.name}</p>
        <p className="text-xl font-bold text-primary">${vendor.price} per person</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="customerName">Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              required
            />
          </div>
          <div className="flex-1 min-w-[150px] space-y-2">
            <Label htmlFor="guests">Guests</Label>
            <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="flex-1 min-w-[150px] space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px] space-y-2">
            <Label>Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 min-w-[120px] space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea
            id="specialRequests"
            placeholder="Any special requests or requirements..."
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold text-primary">
              ${(vendor.price * parseInt(formData.guests)).toFixed(2)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!validateForm()}>
              Book Now
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
