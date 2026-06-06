'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import CreovLogo from '@/components/ui/CREOVLOGO'

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
            <div className="min-h-screen flex items-center justify-center bg-[#060a1a] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden relative">
                {/* Immersive background glows */}
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow" />
                </div>

                {/* Cyber Grid Pattern */}
                <div 
                    className="absolute inset-0 -z-10 opacity-[0.05] animate-grid-flow"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
                        backgroundSize: '32px 32px'
                    }} 
                />

                <div className="bg-[#080c1e]/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] glow-cyan text-center transition-all duration-300">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Email Sent!</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        We sent a password reset link to <span className="text-cyan-400 font-semibold">{email}</span>.<br />
                        Please check your inbox.
                    </p>
                    <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7M5 12h14"/>
                        </svg>
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#060a1a] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden relative">
            {/* Immersive background glows */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[90px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
            </div>

            {/* Cyber Grid Pattern */}
            <div 
                className="absolute inset-0 -z-10 opacity-[0.05] animate-grid-flow"
                style={{
                    backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
                    backgroundSize: '32px 32px'
                }} 
            />

            <div className="bg-[#080c1e]/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] glow-cyan transition-all duration-300 hover:border-cyan-500/10 my-8">
                
                {/* Unified CreovLogo Brand */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/">
                        <CreovLogo className="w-12 h-12 mb-4" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Reset Password</h1>
                    <p className="text-slate-400 text-sm mt-1">We'll email you a recovery link</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                        <span>❌</span> {error}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full inline-flex items-center justify-center text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden btn-3d-cyan"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] group-hover:shadow-[0_4px_30px_rgba(139,92,246,0.4)]" />
                        <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </span>
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Remembered password?{' '}
                    <Link href="/auth/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}