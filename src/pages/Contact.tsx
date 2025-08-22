import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactImageUrl = "https://images.unsplash.com/photo-1587560699334-cc426240169f";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    // For now, we'll just show a success message.
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${contactImageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold">Get in Touch</h1>
            <p className="text-xl md:text-2xl mt-4">We're here to help you plan your perfect Belizean getaway.</p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground mb-6">
                    Have a question or need to speak with us directly? Here's how you can reach us.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone & WhatsApp</h3>
                      <p className="text-muted-foreground">+501-226-2012</p>
                      <p className="text-sm text-muted-foreground">Available 6:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">concierge@caribeconcierge.com</p>
                      <p className="text-sm text-muted-foreground">Replies within 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Our Office</h3>
                      <p className="text-muted-foreground">San Pedro Town, Ambergris Caye, Belize</p>
                      <p className="text-sm text-muted-foreground">By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Your email" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="What can we help you with?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full" variant="ocean">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
