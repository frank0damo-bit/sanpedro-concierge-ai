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

interface Conversation {
  id: string;
  title: string;
  type: 'booking' | 'request';
  status: string;
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sender_type: 'user' | 'staff';
  created_at: string;
}

const Messages = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Handle concierge chat
    if (selectedConversation.id === 'concierge-chat') {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender_type: 'user',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate AI response (you would call your AI service here)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for your message! I'm here to help you with any questions about San Pedro, Belize. How can I assist you today?",
          sender_type: 'staff',
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Chat with our concierge and support team</p>
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
                  {/* Concierge Chat - Always available */}
                  <div
                    onClick={() => setSelectedConversation({
                      id: 'concierge-chat',
                      title: 'Concierge',
                      type: 'booking',
                      status: 'active',
                      unread_count: 0
                    })}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b ${
                      selectedConversation?.id === 'concierge-chat' ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        Concierge
                      </h4>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        24/7
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get instant help with recommendations and bookings
                    </p>
                  </div>

                  {/* ... (rest of the conversations list remains the same) */}
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
                          {selectedConversation.id === 'concierge-chat' ? (
                            <Bot className="h-5 w-5 text-primary" />
                          ) : selectedConversation.type === 'booking' ? (
                            <Calendar className="h-5 w-5" />
                          ) : (
                            <HelpCircle className="h-5 w-5" />
                          )}
                          {selectedConversation.title}
                        </CardTitle>
                        <CardDescription>
                          {selectedConversation.id === 'concierge-chat' ? 'Digital Assistant' : selectedConversation.type === 'booking' ? 'Booking Request' : 'Support Request'}
                        </CardDescription>
                      </div>
                      {selectedConversation.id !== 'concierge-chat' && (
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
                         {messages.length === 0 && selectedConversation.id === 'concierge-chat' && (
                           <div className="text-center py-8">
                             <Bot className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                             <h3 className="font-semibold mb-2">Welcome to your personal Concierge!</h3>
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
                             className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                           >
                             <div
                               className={`max-w-[70%] rounded-lg p-3 ${
                                 message.sender_type === 'user'
                                   ? 'bg-primary text-primary-foreground'
                                   : 'bg-muted'
                               }`}
                             >
                               <div className="flex items-start gap-2">
                                 {message.sender_type === 'staff' && (
                                   <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                 )}
                                 {message.sender_type === 'user' && (
                                   <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                 )}
                                 <div className="flex-1">
                                   <p className="text-sm">{message.content}</p>
                                   <p className="text-xs opacity-70 mt-1">
                                     {new Date(message.created_at).toLocaleTimeString()}
                                   </p>
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                         <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <Separator />
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
