import { NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify Admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { templateId, action, reason } = body

    if (!templateId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    const updateData = {
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    }

    if (action === 'reject') {
      if (!reason) return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
      updateData.rejection_reason = reason
    } else {
      updateData.rejection_reason = null
    }

    // Use supabaseAdmin to bypass RLS for updating another user's template
    const { data, error } = await supabaseAdmin
      .from('templates')
      .update(updateData)
      .eq('id', templateId)

    if (error) {
      console.error('Moderation DB Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, status })

  } catch (err) {
    console.error('Moderation Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
