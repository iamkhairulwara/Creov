'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWebsites: 0,
    totalTemplates: 0,
    totalPrompts: 0
  })
  const [recentWebsites, setRecentWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        
        const { stats: newStats, recentWebsites: recent } = await res.json()
        
        setStats(newStats || {
          totalUsers: 0,
          totalWebsites: 0,
          totalTemplates: 0,
          totalPrompts: 0
        })
        setRecentWebsites(recent || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const StatCard = ({ title, value, icon, color, glowClass }) => (
    <div className={`bg-white/[0.02] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-${color}-500/30`}>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mt-2.5 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${glowClass}`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, Admin! Here is your platform overview.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          color="cyan" 
          glowClass="glow-cyan"
          icon={
            <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          } 
        />
        <StatCard 
          title="Total Websites" 
          value={stats.totalWebsites} 
          color="blue" 
          glowClass="glow-cyan"
          icon={
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          } 
        />
        <StatCard 
          title="Templates" 
          value={stats.totalTemplates} 
          color="purple" 
          glowClass="glow-purple"
          icon={
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          } 
        />
        <StatCard 
          title="AI Prompts" 
          value={stats.totalPrompts} 
          color="violet" 
          glowClass="glow-purple"
          icon={
            <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          } 
        />
      </div>
      
      <div className="bg-[#030712] rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-white tracking-tight">Recent Websites</h2>
            <p className="text-slate-400 text-xs mt-0.5">The latest digital experiences synthesized on the platform.</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Live Feed
          </span>
        </div>
        
        <div className="space-y-3">
          {recentWebsites.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center text-sm font-black text-cyan-300">
                  {item.title?.[0]?.toUpperCase() || 'W'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">
                    {item.title || 'Untitled Website'}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5 font-light">
                    <span>by</span>
                    <span className="font-semibold text-slate-300">{item.profiles?.email || 'Anonymous User'}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                <div className="flex flex-col sm:items-end gap-1.5">
                  {item.source === 'generated' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> AI Synthesized
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> Custom Template
                    </span>
                  )}
                  <span className="text-slate-500 text-[10px] font-semibold tracking-wider uppercase font-mono">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recentWebsites.length === 0 && (
            <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-500 mb-3 block">
                <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              <p className="text-slate-500 text-sm mt-3">No websites created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}