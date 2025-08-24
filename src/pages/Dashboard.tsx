import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MessageSquare, Plus, Phone, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Header } from '@/components/Header';

// ... (interface definitions remain the same)

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { isStaff } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchUserData = async () => {
    // ... (fetchUserData function remains the same)
  };

  const handleSignOut = async () => {
    // ... (handleSignOut function remains the same)
  };

  const getStatusColor = (status: string) => {
    // ... (getStatusColor function remains the same)
  };

  const getPriorityColor = (priority: string) => {
    // ... (getPriorityColor function remains the same)
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-xl">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">Manage your concierge services and requests</p>
          </div>
          <div className="flex gap-3">
            <Link to="/book">
              <Button variant="ocean">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline">
                <Phone className="h-4 w-4" />
                Support
              </Button>
            </Link>
            {isStaff && (
              <Link to="/admin">
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Button onClick={handleSignOut} variant="ghost">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/book">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Book a Service</h3>
                <p className="text-sm text-muted-foreground">Request restaurants, excursions, and more</p>
              </CardContent>
            </Card>
          </Link>
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/messages')}
          >
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Chat with Concierge</h3>
              <p className="text-sm text-muted-foreground">Get instant help and recommendations</p>
            </CardContent>
          </Card>
          <Link to="/support">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">Get help and assistance</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="requests">My Requests ({requests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4 mt-6">
            {/* ... (bookings content remains the same) */}
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4 mt-6">
            {/* ... (requests content remains the same) */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
