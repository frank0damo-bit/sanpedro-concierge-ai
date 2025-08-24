// supabase/functions/get-service-vendors/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { serviceId } = await req.json();
    if (!serviceId) {
      throw new Error("Service ID is required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: serviceData, error: serviceError } = await supabaseAdmin
      .from('service_categories')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError) throw serviceError;

    const { data: vendorLinkData, error: vendorError } = await supabaseAdmin
      .from('service_vendors')
      .select('price, vendors (*)')
      .eq('service_category_id', serviceId);

    if (vendorError) throw vendorError;

    const vendors = (vendorLinkData || []).map((item: any) => ({
      ...item.vendors,
      price: item.price,
    })).filter(Boolean);

    const responsePayload = { service: serviceData, vendors: vendors };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
