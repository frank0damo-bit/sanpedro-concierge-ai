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
    const { prompt, partySize, travelDates } = await req.json();
    
    console.log('Received request:', { prompt, partySize, travelDates });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch available service categories
    const { data: serviceCategories, error: servicesError } = await supabase
      .from('service_categories')
      .select('id, name, description, price, features')
      .eq('active', true)
      .order('sort_order');

    if (servicesError) {
      console.error('Error fetching service categories:', servicesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch service categories' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create system prompt for OpenAI
    const systemPrompt = `You are a travel concierge for San Pedro, Belize. Create a personalized trip package based on the user's request.

Available services:
${serviceCategories.map(service => 
  `- ${service.name}: ${service.description} (Price: $${service.price || 'Custom pricing'})
  Features: ${service.features ? service.features.join(', ') : 'Contact for details'}`
).join('\n')}

Rules:
1. Only recommend services from the available list above
2. Consider the party size of ${partySize} people
3. Consider travel dates: ${travelDates ? JSON.stringify(travelDates) : 'Not specified'}
4. Create a cohesive package that makes sense for San Pedro, Belize
5. Provide realistic pricing based on the services
6. Include 3-5 recommended services maximum
7. Respond ONLY with valid JSON in this exact format:

{
  "title": "Trip package title",
  "description": "Brief description of the package",
  "items": [
    {
      "serviceCategoryId": "uuid-from-available-services",
      "title": "Service title",
      "description": "Why this service fits the trip",
      "quantity": 1,
      "unitPrice": 100,
      "notes": "Any special notes"
    }
  ]
}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate trip package' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;
    
    console.log('OpenAI response:', generatedContent);

    // Parse the JSON response from OpenAI
    let packageData;
    try {
      packageData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse trip package data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total price
    const totalPrice = packageData.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    // Create the curated package
    const { data: curatedPackage, error: packageError } = await supabase
      .from('curated_packages')
      .insert({
        user_id: user.id,
        title: packageData.title,
        description: packageData.description,
        prompt: prompt,
        party_size: partySize,
        travel_dates: travelDates,
        total_price: totalPrice,
        status: 'draft'
      })
      .select()
      .single();

    if (packageError) {
      console.error('Error creating package:', packageError);
      return new Response(
        JSON.stringify({ error: 'Failed to create trip package' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create package items
    const packageItems = packageData.items.map((item: any) => ({
      package_id: curatedPackage.id,
      service_category_id: item.serviceCategoryId,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from('curated_package_items')
      .insert(packageItems);

    if (itemsError) {
      console.error('Error creating package items:', itemsError);
      return new Response(
        JSON.stringify({ error: 'Failed to create package items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully created trip package:', curatedPackage.id);

    return new Response(
      JSON.stringify({ 
        packageId: curatedPackage.id,
        package: curatedPackage,
        items: packageItems
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-trip-package function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});