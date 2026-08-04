import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  try {
    const { userId, websiteId, exportType } = await request.json();
    
    if (!userId || !websiteId || !exportType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('exports')
      .insert({
        user_id: userId,
        website_id: websiteId,
        export_type: exportType
      })
      .select('id')
      .single();

    if (error) {
      console.error("Exports DB insert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Exports route error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
