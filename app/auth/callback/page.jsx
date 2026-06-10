'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
    const router = useRouter()
    const [error, setError] = useState(null)
    const [status, setStatus] = useState('Processing authentication...')

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                console.log('🔍 Callback: Processing authentication...')
                console.log('📍 Current URL:', window.location.href)

                setStatus('Getting session...')

                // Get the session - this is critical
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.error('Session error:', sessionError)
                    setError(sessionError.message)
                    setStatus('Authentication failed')
                    setTimeout(() => router.replace('/auth/login?error=session'), 2000)
                    return
                }

                if (session) {
                    console.log('✅ Session found for:', session.user.email)
                    setStatus(`Welcome ${session.user.email}! Redirecting...`)
                    setTimeout(() => router.replace('/'), 1000)
                    return
                }

                // If no session, try to get from URL hash
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                if (accessToken) {
                    console.log('🔑 Found access token, setting session...')
                    setStatus('Setting up your session...')

                    const { data, error: setSessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    })

                    if (setSessionError) {
                        console.error('Set session error:', setSessionError)
                        setError(setSessionError.message)
                        setStatus('Failed to set session')
                        setTimeout(() => router.replace('/auth/login?error=session'), 2000)
                        return
                    }

                    if (data.session) {
                        console.log('✅ Session set for:', data.session.user.email)
                        setStatus(`Welcome ${data.session.user.email}! Redirecting...`)
                        setTimeout(() => router.replace('/'), 1000)
                        return
                    }
                }

                // Also check for code in URL
                const urlParams = new URLSearchParams(window.location.search)
                const code = urlParams.get('code')

                if (code) {
                    console.log('🔑 Exchanging code for session...')
                    setStatus('Exchanging verification code...')

                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                    if (exchangeError) {
                        console.error('Exchange error:', exchangeError)
                        setError(exchangeError.message)
                        setStatus('Code exchange failed')
                        setTimeout(() => router.replace('/auth/login?error=exchange'), 2000)
                        return
                    }

                    if (data.session) {
                        console.log('✅ Session created for:', data.session.user.email)
                        setStatus(`Welcome ${data.session.user.email}! Redirecting...`)
                        setTimeout(() => router.replace('/'), 1000)
                        return
                    }
                }

                console.error('❌ No authentication data found')
                setError('No authentication data received')
                setStatus('Redirecting to login...')
                setTimeout(() => router.replace('/auth/login?error=no_data'), 2000)

            } catch (err) {
                console.error('Callback error:', err)
                setError(err.message)
                setStatus('An error occurred')
                setTimeout(() => router.replace('/auth/login?error=callback'), 2000)
            }
        }

        handleAuthCallback()
    }, [router])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-400 text-lg mb-2">Authentication Error</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                    <p className="text-gray-500 text-xs mt-4">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg mb-2">{status}</p>
                <p className="text-gray-500 text-sm">Please wait while we complete your sign in...</p>
            </div>
        </div>
    )
}