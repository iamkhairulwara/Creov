'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import CustomSelect from '@/components/ui/CustomSelect'

const Cal7Icon = () => <span className="mr-1">📅</span>
const Cal30Icon = () => <span className="mr-1">📅</span>
const Cal90Icon = () => <span className="mr-1">📅</span>

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days', icon: <Cal7Icon /> },
  { value: '30d', label: 'Last 30 days', icon: <Cal30Icon /> },
  { value: '90d', label: 'Last 90 days', icon: <Cal90Icon /> }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState({
    dailyStats: [],
    categoryBreakdown: [],
    aiPerformance: [],
    userActivity: [],
    totalGenerations: 0,
    avgGenerationTime: 0,
    successRate: 0,
    topUsers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    
    // Get days based on range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 1. Daily website generations
    const { data: websites } = await supabase
      .from('websites')
      .select('created_at, source, user_id')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Initialize dates with 0 to ensure graphs render correctly even without data
    const dailyMap = new Map()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString()
      dailyMap.set(dateStr, { date: dateStr, count: 0, ai: 0, template: 0 })
    }

    websites?.forEach(w => {
      const date = new Date(w.created_at).toLocaleDateString()
      if (dailyMap.has(date)) {
        const entry = dailyMap.get(date)
        entry.count++
        if (w.source === 'generated') entry.ai++
        else entry.template++
      }
    })
    
    const dailyStats = Array.from(dailyMap.values())

    // 2. Category breakdown from templates
    const { data: templates } = await supabase
      .from('templates')
      .select('category, websites(count)')
    
    const categoryMap = new Map()
    templates?.forEach(t => {
      const count = parseInt(t.websites?.[0]?.count || 0)
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + count)
    })

    if (categoryMap.size === 0) {
      categoryMap.set('No Data', 1)
    }
    
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }))

    // 3. AI Performance (mock - would need actual logs table)
    const aiPerformance = [
      { model: 'Gemini 2.0', success: 92, avgTime: 28, usage: 1247 },
      { model: 'Gemini 1.5', success: 95, avgTime: 35, usage: 456 }
    ]

    // 4. User activity (top users by websites)
    let topUsers = []
    if (websites && websites.length > 0) {
      const userMap = new Map()
      websites.forEach(w => {
        if (w.user_id) {
          userMap.set(w.user_id, (userMap.get(w.user_id) || 0) + 1)
        }
      })
      const sorted = Array.from(userMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id, count, email: 'Loading...', name: '' }))
      
      // Fetch all users to map their emails
      let allUsers = []
      try {
        const res = await fetch('/api/admin/users')
        if (res.ok) {
          const { data } = await res.json()
          allUsers = data || []
        }
      } catch (e) {
        console.error("Failed to fetch users:", e)
      }

      for (const user of sorted) {
        const profile = allUsers.find(u => u.id === user.id)
        user.email = profile?.email || 'Unknown User'
        user.name = profile?.full_name || user.email
      }
      topUsers = sorted
    }

    // 5. Overall stats
    const totalGenerations = websites?.length || 0
    const successRate = 94.5 // Mock - would calculate from logs
    const avgGenerationTime = 26.4 // Mock

    setAnalytics({
      dailyStats,
      categoryBreakdown,
      aiPerformance,
      userActivity: topUsers || [],
      totalGenerations,
      avgGenerationTime,
      successRate
    })
    setLoading(false)
  }

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

  const StatCard = ({ title, value, subtitle, icon, trend, color, glowClass }) => (
    <div className={`glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-${color}-500/30`}>
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-${color}-500/5 blur-xl group-hover:bg-${color}-500/10 transition-all duration-500`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${glowClass}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trend > 0 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-black text-white tracking-tight relative z-10 group-hover:scale-105 origin-left transition-transform duration-300">
        {value}
      </h3>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1 relative z-10">{title}</p>
      {subtitle && <p className="text-slate-500 text-xs mt-2 relative z-10">{subtitle}</p>}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">AI performance, generations rate, & platform insights.</p>
        </div>
        <div className="relative w-48">
          <CustomSelect
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Generations" 
          value={analytics.totalGenerations} 
          color="cyan"
          glowClass="glow-cyan"
          trend={12}
          icon={
            <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          }
        />
        <StatCard 
          title="Success Rate" 
          value={`${analytics.successRate}%`} 
          color="blue"
          glowClass="glow-cyan"
          trend={2}
          icon={
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          }
        />
        <StatCard 
          title="Avg Response" 
          value={`${analytics.avgGenerationTime}s`} 
          color="purple"
          glowClass="glow-purple"
          trend={-5}
          icon={
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
        <StatCard 
          title="Active Users" 
          value={analytics.userActivity.length} 
          color="violet"
          glowClass="glow-purple"
          trend={8}
          icon={
            <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Website Generations */}
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-xl glow-cyan">
          <h2 className="text-lg font-bold text-white tracking-wide mb-4">Daily Website Generations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyStats}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#040818', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown - Pie Chart */}
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-xl glow-cyan">
          <h2 className="text-lg font-bold text-white tracking-wide mb-4">Website Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={6}
                dataKey="value"
              >
                {analytics.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff08" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#040818', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Model Performance */}
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-xl glow-purple">
          <h2 className="text-lg font-bold text-white tracking-wide mb-5">AI Model Performance</h2>
          <div className="space-y-5">
            {analytics.aiPerformance.map((model, idx) => (
              <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold text-sm tracking-wide">{model.model}</span>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{model.success}% success</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-light">
                  <span>Avg Response time</span>
                  <span className="font-semibold text-slate-300">{model.avgTime} seconds</span>
                </div>
                <div className="w-full bg-white/5 border border-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${model.success}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5 font-bold uppercase tracking-wider">{model.usage} total calls</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-xl glow-purple">
          <h2 className="text-lg font-bold text-white tracking-wide mb-5">Most Active Users</h2>
          <div className="space-y-3.5">
            {analytics.userActivity.length > 0 ? (
              analytics.userActivity.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-[#030612]/30 hover:bg-[#030612]/60 hover:border-cyan-500/15 hover:shadow-[0_4px_20px_rgba(6,182,212,0.03)] transition-all duration-300">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center text-cyan-400 text-xs font-black">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold tracking-wide">{user.name || user.email}</p>
                      <p className="text-slate-500 text-xs font-light">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                      {user.count} <span className="text-[10px] font-bold text-slate-400">SITES</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/[0.02] rounded-xl border border-white/5">
                <p className="text-slate-500 text-sm font-semibold">No user activity found</p>
                <p className="text-slate-600 text-xs mt-1">There are no user generated websites in this period.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}