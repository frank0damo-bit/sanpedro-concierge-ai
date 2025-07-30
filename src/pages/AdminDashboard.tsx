import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Calendar, HelpCircle, Users, Send } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_type: string;
  created_at: string;
  user_id: string;
  booking_id?: string;
  request_id?: string;
}

interface Conversation {
  id: string;
  title: string;
  type: 'booking' | 'request' | 'ai';
  user_id: string;
  user_name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  status: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isStaff, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading && isStaff) {
      fetchConversations();
    }
  }, [authLoading, roleLoading, isStaff]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, title, status, user_id, created_at')
        .order('created_at', { ascending: false });

      // Fetch customer requests
      const { data: requests, error: requestsError } = await supabase
        .from('customer_requests')
        .select('id, subject, status, user_id, created_at')
        .order('created_at', { ascending: false });

      // Fetch all profiles to map user data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      if (bookingsError) throw bookingsError;
      if (requestsError) throw requestsError;
      if (profilesError) throw profilesError;

      // Create a map of user profiles for quick lookup
      const profileMap = new Map();
      profiles?.forEach((profile: any) => {
        profileMap.set(profile.user_id, profile);
      });

      const conversationList: Conversation[] = [];

      // Add bookings
      bookings?.forEach((booking: any) => {
        const profile = profileMap.get(booking.user_id);
        conversationList.push({
          id: booking.id,
          title: booking.title,
          type: 'booking',
          user_id: booking.user_id,
          user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User',
          status: booking.status,
          unread_count: 0
        });
      });

      // Add requests
      requests?.forEach((request: any) => {
        const profile = profileMap.get(request.user_id);
        conversationList.push({
          id: request.id,
          title: request.subject,
          type: 'request',
          user_id: request.user_id,
          user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User',
          status: request.status,
          unread_count: 0
        });
      });

      setConversations(conversationList);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;

    try {
      const query = supabase
        .from('messages')
        .select('*')
        .eq('user_id', selectedConversation.user_id)
        .order('created_at', { ascending: true });

      if (selectedConversation.type === 'booking') {
        query.eq('booking_id', selectedConversation.id);
      } else if (selectedConversation.type === 'request') {
        query.eq('request_id', selectedConversation.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const messageData = {
        content: newMessage,
        sender_type: 'staff',
        user_id: selectedConversation.user_id,
        message_type: 'text',
        ...(selectedConversation.type === 'booking' 
          ? { booking_id: selectedConversation.id }
          : { request_id: selectedConversation.id }
        )
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (status: string) => {
    if (!selectedConversation) return;

    try {
      const table = selectedConversation.type === 'booking' ? 'bookings' : 'customer_requests';
      
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', selectedConversation.id);

      if (error) throw error;

      setSelectedConversation({ ...selectedConversation, status });
      fetchConversations();
      
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || roleLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage customer conversations and requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={`${conv.type}-${conv.id}`}
                      className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {conv.type === 'booking' ? (
                            <Calendar className="h-4 w-4" />
                          ) : (
                            <HelpCircle className="h-4 w-4" />
                          )}
                          <span className="font-medium">{conv.user_name}</span>
                        </div>
                        <Badge className={getStatusColor(conv.status)}>
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.title}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedConversation.title}</CardTitle>
                      <CardDescription>
                        Conversation with {selectedConversation.user_name}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(selectedConversation.status === 'resolved' ? 'open' : 'resolved')}
                      >
                        {selectedConversation.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                      </Button>
                      <Badge className={getStatusColor(selectedConversation.status)}>
                        {selectedConversation.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[calc(100vh-400px)]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_type === 'staff' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender_type === 'staff'
                              ? 'bg-primary text-primary-foreground'
                              : message.sender_type === 'ai'
                              ? 'bg-muted'
                              : 'bg-secondary'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleString()} • {message.sender_type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={3}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="icon"
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;