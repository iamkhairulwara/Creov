'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleReset = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-96 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Check <span className="text-cyan-400">{email}</span> for a password reset link.
                    </p>
                    <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-96">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-gray-400 text-sm">Enter your email and we'll send a reset link</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}