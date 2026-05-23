import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
    let res = NextResponse.next({
        request: { headers: req.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set(name, value)
                        res = NextResponse.next({ request: req })
                        res.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Refresh session — critical for SSR cookie sync
    const { data: { session } } = await supabase.auth.getSession()

    const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/callback', '/auth/forgot-password', '/auth/reset-password']
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    // Never block API routes
    if (isApiRoute) return res

    // Not logged in, trying to access protected route
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Logged in but trying to access login page → send to generate
    if (session && req.nextUrl.pathname === '/auth/login') {
        return NextResponse.redirect(new URL('/generate', req.url))
    }

    return res
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}