import { NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [{ count: users }, { count: websites }, { count: templates }, { count: prompts }] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('websites').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('templates').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('prompts').select('*', { count: 'exact', head: true })
  ])

  const { data: recent } = await supabaseAdmin
    .from('websites')
    .select(`
      id,
      title,
      source,
      created_at,
      profiles (email, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json({
    stats: {
      totalUsers: users || 0,
      totalWebsites: websites || 0,
      totalTemplates: templates || 0,
      totalPrompts: prompts || 0
    },
    recentWebsites: recent || []
  })
}
