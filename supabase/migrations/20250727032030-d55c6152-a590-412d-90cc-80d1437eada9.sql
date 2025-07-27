-- Create messages table for AI chat and conversation history
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID NULL,
  request_id UUID NULL,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'ai', 'staff')),
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'booking_suggestion', 'system')),
  metadata JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add foreign key relationships
ALTER TABLE public.messages 
ADD CONSTRAINT fk_messages_booking 
FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;

ALTER TABLE public.messages 
ADD CONSTRAINT fk_messages_request 
FOREIGN KEY (request_id) REFERENCES public.customer_requests(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_booking_id ON public.messages(booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX idx_messages_request_id ON public.messages(request_id) WHERE request_id IS NOT NULL;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;