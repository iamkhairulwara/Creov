import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function parseFullHtml(fullHtml) {
  if (!fullHtml) return { bodyHtml: '', cssContent: '', jsContent: '' }

  fullHtml = fullHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim()
  fullHtml = fullHtml.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  if (!fullHtml.trim().startsWith('<html') && !fullHtml.trim().startsWith('<!DOCTYPE')) {
    return { bodyHtml: fullHtml, cssContent: '', jsContent: '' }
  }

  // Very basic regex-based extraction to avoid heavy DOM parser dependencies on the server
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : fullHtml;

  const styleMatches = [...fullHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  let cssContent = styleMatches.map(m => m[1]).join('\n');

  const linkMatches = [...fullHtml.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
  const fontImports = linkMatches.map(m => `@import url('${m[1]}');`).join('\n');
  if (fontImports) cssContent = fontImports + '\n' + cssContent;

  const scriptMatches = [...fullHtml.matchAll(/<script\b(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
  const jsContent = scriptMatches.map(m => m[1]).join('\n');

  return { bodyHtml, cssContent, jsContent }
}

export async function GET(request, { params }) {
  const { slug } = await params;

  if (!slug || slug === 'undefined') {
    return new NextResponse("Not Found", { status: 404 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  
  // Check if it's a UUID (legacy link) or a slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  const query = supabaseAdmin.from('websites').select('*');
  
  if (isUUID) {
    query.eq('id', slug);
  } else {
    query.eq('slug', slug);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return new NextResponse("Website Not Found", { status: 404 });
  }

  // Auto-redirect to the clean slug if they used the UUID and a slug exists!
  if (isUUID && data.slug) {
    return NextResponse.redirect(new URL(`/p/${data.slug}`, request.url));
  }

  // Reconstruct the full HTML
  const { bodyHtml, cssContent, jsContent } = parseFullHtml(data.html || '');
  
  const finalCss = data.css || cssContent;
  const finalJs = data.js || jsContent;
  const title = data.title || 'Published Website';

  const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    ${finalCss}
  </style>
</head>
<body>
  ${bodyHtml}
  <script>
    ${finalJs}
  </script>
</body>
</html>`;

  // Serve natively as text/html!
  return new NextResponse(finalHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=600'
    },
  });
}
