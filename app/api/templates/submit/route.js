import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import sanitizeHtml from 'sanitize-html'

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, html, css, js } = body

    if (!title || !category || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sanitize the HTML using sanitize-html
    const cleanHtml = sanitizeHtml(html, {
      allowedTags: false, // allow all tags except the ones filtered out
      allowedAttributes: false, // allow all attributes
      allowVulnerableTags: true, // suppress warnings about style/script since we filter script manually
      exclusiveFilter: function(frame) {
        return ['script', 'iframe', 'object', 'embed', 'form'].includes(frame.tag);
      }
    })

    // Prepare template object
    const templateData = {
      title,
      description,
      category,
      html: cleanHtml,
      css: css || '',
      js: js || '',
      is_user_submitted: true,
      status: 'pending',
      submitted_by: user.id,
      usage_count: 0
    }

    // Insert into database using authenticated user client to respect RLS
    const { data, error } = await supabase
      .from('templates')
      .insert(templateData)
      .select()
      .single()

    if (error) {
      console.error('Submission DB Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (err) {
    console.error('Submission Server Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
