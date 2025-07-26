import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Send, MessageCircle, Clock, User, Headphones } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'staff';
  created_at: string;
  booking_id?: string;
  request_id?: string;
}

interface Conversation {
  id: string;
  title: string;
  type: 'booking' | 'request';
  status: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

const Messages = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  if (loading) {
    return <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, title, status, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch customer requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('customer_requests')
        .select('id, subject, status, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Transform data into conversations
      const bookingConversations: Conversation[] = (bookingsData || []).map(booking => ({
        id: `booking-${booking.id}`,
        title: booking.title,
        type: 'booking' as const,
        status: booking.status,
        last_message: "Your booking request has been received",
        last_message_time: booking.created_at,
        unread_count: 0,
      }));

      const requestConversations: Conversation[] = (requestsData || []).map(request => ({
        id: `request-${request.id}`,
        title: request.subject,
        type: 'request' as const,
        status: request.status,
        last_message: "Your support request has been received",
        last_message_time: request.created_at,
        unread_count: 0,
      }));

      const allConversations = [...bookingConversations, ...requestConversations]
        .sort((a, b) => new Date(b.last_message_time!).getTime() - new Date(a.last_message_time!).getTime());

      setConversations(allConversations);

      // Auto-select first conversation if none selected
      if (allConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(allConversations[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      // For now, we'll create mock messages since we don't have a messages table yet
      // In a real implementation, you'd query the messages table
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hello! Thank you for your request. Our concierge team has received it and will get back to you shortly.',
          sender_type: 'staff',
          created_at: new Date(Date.now() - 60000).toISOString(),
        },
        {
          id: '2',
          content: 'Thank you for the quick response! I look forward to hearing from you.',
          sender_type: 'customer',
          created_at: new Date(Date.now() - 30000).toISOString(),
        },
      ];

      setMessages(mockMessages);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      // For now, we'll add the message locally
      // In a real implementation, you'd save to the database
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender_type: 'customer',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      toast({
        title: "Message sent",
        description: "Your message has been sent to our concierge team",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': case 'resolved': return 'bg-green-100 text-green-800';
      case 'cancelled': case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  if (loadingConversations) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-xl">Loading conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Communicate with our concierge team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversations
                </CardTitle>
                <CardDescription>Your booking and support conversations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No conversations yet
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                          selectedConversation === conversation.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
                          <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.last_message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.type === 'booking' ? 'Booking' : 'Support'}
                          </span>
                          {conversation.last_message_time && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.last_message_time).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="md:col-span-2">
              {selectedConversationData ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{selectedConversationData.title}</CardTitle>
                        <CardDescription>
                          {selectedConversationData.type === 'booking' ? 'Booking Request' : 'Support Request'}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(selectedConversationData.status)}>
                        {selectedConversationData.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <ScrollArea className="h-[380px] p-4">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-muted-foreground">Loading messages...</div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                message.sender_type === 'customer' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {message.sender_type === 'staff' && (
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <Headphones className="h-4 w-4 text-primary-foreground" />
                                </div>
                              )}
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender_type === 'customer'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                              {message.sender_type === 'customer' && (
                                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-accent-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <Separator />
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          disabled={sending}
                        />
                        <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
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
    </div>
  );
};

export default Messages;