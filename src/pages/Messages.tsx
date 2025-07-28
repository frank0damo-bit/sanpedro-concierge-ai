import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle, Calendar, HelpCircle, Bot, User } from 'lucide-react';
import { Header } from '@/components/Header';

// Message interface for individual messages
interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'ai' | 'staff';
  created_at: string;
  booking_id?: string;
  request_id?: string;
}

// Conversation interface
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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      // Set up AI chat as default conversation
      setSelectedConversation({
        id: 'ai-chat',
        title: 'AI Concierge',
        type: 'booking',
        status: 'active',
        unread_count: 0
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        id: booking.id,
        title: booking.title,
        type: 'booking' as const,
        status: booking.status,
        last_message: "Your booking request has been received",
        last_message_time: booking.created_at,
        unread_count: 0,
      }));

      const requestConversations: Conversation[] = (requestsData || []).map(request => ({
        id: request.id,
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

  const fetchMessages = async () => {
    if (!user || !selectedConversation) return;

    try {
      if (selectedConversation.id === 'ai-chat') {
        // Fetch AI chat messages
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .is('booking_id', null)
          .is('request_id', null)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages((data || []) as Message[]);
      } else {
        // Fetch conversation-specific messages
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .or(`booking_id.eq.${selectedConversation.id},request_id.eq.${selectedConversation.id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages((data || []) as Message[]);
      }
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

    setSendingMessage(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      if (selectedConversation.id === 'ai-chat') {
        // Send to AI chat
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: messageText,
            conversation_id: selectedConversation.id,
            booking_id: null,
            request_id: null
          }
        });

        if (error) throw error;

        if (!data.success) {
          throw new Error(data.error || 'Failed to send message');
        }

        // Messages are automatically added via real-time subscription
        toast({
          title: "Message sent",
          description: "Your message has been sent to the AI concierge",
        });
      } else {
        // Handle regular conversation messages
        const { error } = await supabase
          .from('messages')
          .insert({
            user_id: user.id,
            content: messageText,
            sender_type: 'customer',
            booking_id: selectedConversation.type === 'booking' ? selectedConversation.id : null,
            request_id: selectedConversation.type === 'request' ? selectedConversation.id : null,
          });

        if (error) throw error;

        toast({
          title: "Message sent",
          description: "Your message has been sent to our support team",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Restore the message input if sending failed
      setNewMessage(messageText);
    } finally {
      setSendingMessage(false);
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
            <p className="text-muted-foreground">Chat with our AI concierge and support team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  {/* AI Chat - Always available */}
                  <div
                    onClick={() => setSelectedConversation({
                      id: 'ai-chat',
                      title: 'AI Concierge',
                      type: 'booking',
                      status: 'active',
                      unread_count: 0
                    })}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b ${
                      selectedConversation?.id === 'ai-chat' ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        AI Concierge
                      </h4>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        AI
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get instant help with recommendations and bookings
                    </p>
                  </div>

                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No other conversations yet</p>
                      <p className="text-xs">Your booking and support conversations will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{conversation.title}</h4>
                            {conversation.unread_count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            {conversation.type === 'booking' ? (
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground capitalize">
                              {conversation.type}
                            </span>
                            <Badge 
                              className={`text-xs ${getStatusColor(conversation.status)}`}
                            >
                              {conversation.status}
                            </Badge>
                          </div>
                          {conversation.last_message && (
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.last_message}
                            </p>
                          )}
                          {conversation.last_message_time && (
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {new Date(conversation.last_message_time).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="md:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {selectedConversation.id === 'ai-chat' ? (
                            <Bot className="h-5 w-5 text-primary" />
                          ) : selectedConversation.type === 'booking' ? (
                            <Calendar className="h-5 w-5" />
                          ) : (
                            <HelpCircle className="h-5 w-5" />
                          )}
                          {selectedConversation.title}
                        </CardTitle>
                        <CardDescription>
                          {selectedConversation.id === 'ai-chat' ? 'AI Assistant' : selectedConversation.type === 'booking' ? 'Booking Request' : 'Support Request'}
                        </CardDescription>
                      </div>
                      {selectedConversation.id !== 'ai-chat' && (
                        <Badge className={getStatusColor(selectedConversation.status)}>
                          {selectedConversation.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <ScrollArea className="h-[380px] p-4">
                      <div className="space-y-4">
                        {messages.length === 0 && selectedConversation.id === 'ai-chat' && (
                          <div className="text-center py-8">
                            <Bot className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                            <h3 className="font-semibold mb-2">Welcome to your AI Concierge!</h3>
                            <p className="text-muted-foreground mb-4">
                              I'm here to help you with recommendations, bookings, and local information about San Pedro, Belize.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Ask me about restaurants, activities, transportation, or anything else!
                            </p>
                          </div>
                        )}
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_type === 'customer' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className="flex items-start gap-2 max-w-[70%]">
                              {message.sender_type !== 'customer' && (
                                <div className="flex-shrink-0">
                                  {message.sender_type === 'ai' ? (
                                    <Bot className="h-6 w-6 text-primary" />
                                  ) : (
                                    <User className="h-6 w-6 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                              <div
                                className={`rounded-lg p-3 ${
                                  message.sender_type === 'customer'
                                    ? 'bg-primary text-primary-foreground'
                                    : message.sender_type === 'ai'
                                    ? 'bg-secondary/50 border'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                              {message.sender_type === 'customer' && (
                                <div className="flex-shrink-0">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {sendingMessage && (
                          <div className="flex justify-start">
                            <div className="flex items-start gap-2 max-w-[70%]">
                              <Bot className="h-6 w-6 text-primary" />
                              <div className="bg-secondary/50 border rounded-lg p-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <Separator />
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={
                            selectedConversation.id === 'ai-chat' 
                              ? "Ask me about San Pedro, restaurants, activities..." 
                              : "Type your message..."
                          }
                          onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && sendMessage()}
                          disabled={sendingMessage}
                        />
                        <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()}>
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