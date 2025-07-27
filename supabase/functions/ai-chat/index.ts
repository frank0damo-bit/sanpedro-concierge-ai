import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversation_id, booking_id, request_id } = await req.json();

    // Get the Google Gemini API key
    const GEMINI_API_KEY = Deno.env.get('google_gemini_api_key');
    if (!GEMINI_API_KEY) {
      throw new Error('Google Gemini API key not configured');
    }

    // Save user message to database
    const { error: insertError } = await supabaseClient
      .from('messages')
      .insert({
        user_id: user.id,
        content: message,
        sender_type: 'customer',
        booking_id: booking_id || null,
        request_id: request_id || null,
      });

    if (insertError) {
      console.error('Error saving user message:', insertError);
    }

    // Get recent conversation history for context
    const { data: recentMessages } = await supabaseClient
      .from('messages')
      .select('content, sender_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build conversation context
    let conversationHistory = '';
    if (recentMessages && recentMessages.length > 0) {
      conversationHistory = recentMessages
        .reverse()
        .map(msg => `${msg.sender_type === 'customer' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }

    // Get user's profile for personalization
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name, preferred_contact')
      .eq('user_id', user.id)
      .single();

    const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'there';

    // System prompt with local knowledge about San Pedro, Belize
    const systemPrompt = `You are an AI concierge assistant for Caribe Concierge, specializing in San Pedro, Ambergris Caye, Belize. You help guests with recommendations, bookings, and local information.

ABOUT SAN PEDRO, BELIZE:
- Located on Ambergris Caye, the largest island in Belize
- Famous for the Belize Barrier Reef (2nd largest in the world)
- Popular activities: snorkeling, diving, fishing, island hopping
- Local transportation: golf carts, water taxis, boats
- Currency: Belize Dollar (BZD), US Dollar widely accepted
- Language: English (official), Spanish, Kriol

TOP RECOMMENDATIONS:
Restaurants:
- Elvi's Kitchen: Traditional Belizean cuisine, famous for conch fritters
- Hidden Treasure: Upscale dining, great steaks and seafood
- Waruguma: Asian fusion with ocean views
- Estell's Dine by the Sea: Local favorite for fresh seafood
- Blue Water Grill: Beachfront dining, excellent ceviche

Activities:
- Hol Chan Marine Reserve & Shark Ray Alley (snorkeling/diving)
- Secret Beach: Beautiful beach on the west side of the island
- Bacalar Chico Marine Reserve: Pristine diving and snorkeling
- Fishing trips: Permit, tarpon, bonefish, deep sea fishing
- Sunset sailing trips and catamaran tours
- Cave tubing and zip-lining on the mainland

Hotels/Resorts:
- Victoria House: Luxury beachfront resort
- Ramon's Village: Dive-focused resort with thatched roofs
- SunBreeze Hotel: Centrally located, good value
- Mahogany Bay Resort: All-inclusive luxury
- Phoenix Resort: Beachfront condos

INSTRUCTIONS:
- Always be friendly, helpful, and knowledgeable about local attractions
- If users ask about bookings, offer to help them create a service request
- Provide specific recommendations based on their interests
- Include practical tips about transportation, costs, and timing
- If you don't know something specific, admit it and offer to help them find out
- Keep responses conversational and personalized
- Current user's name: ${userName}

Recent conversation:
${conversationHistory}

Current message: ${message}`;

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error. Please try again.';

    // Save AI response to database
    const { error: aiInsertError } = await supabaseClient
      .from('messages')
      .insert({
        user_id: user.id,
        content: aiResponse,
        sender_type: 'ai',
        booking_id: booking_id || null,
        request_id: request_id || null,
      });

    if (aiInsertError) {
      console.error('Error saving AI message:', aiInsertError);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});