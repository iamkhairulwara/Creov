'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const ZapIcon = ({className="w-4 h-4 inline-block mr-1"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const PaletteIcon = ({className="w-4 h-4 inline-block mr-1"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const ClipboardIcon = () => <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>

import CustomSelect from '@/components/ui/CustomSelect'

const FilterAllIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const FilterGenIcon = () => <ZapIcon className="w-4 h-4" />
const FilterTempIcon = () => <PaletteIcon className="w-4 h-4" />

const logFilterOptions = [
  { value: 'all', label: 'All Activities', icon: <FilterAllIcon /> },
  { value: 'generation', label: 'AI Generations', icon: <FilterGenIcon /> },
  { value: 'template', label: 'Template Uses', icon: <FilterTempIcon /> }
]

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    // Fetch recent websites as activity logs
    const { data } = await supabase
      .from('websites')
      .select(`
        id,
        title,
        source,
        created_at,
        profiles(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    const formattedLogs = data?.map(w => ({
      id: w.id,
      action: w.source === 'generated' ? 'AI Generation' : 'Template Used',
      user: w.profiles?.email || 'Anonymous',
      details: `Created "${w.title || 'Untitled'}" website`,
      timestamp: w.created_at,
      type: w.source === 'generated' ? 'generation' : 'template'
    })) || []

    setLogs(formattedLogs)
    setLoading(false)
  }

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter)

  const getActionColor = (type) => {
    switch(type) {
      case 'generation': return 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
      case 'template': return 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
      default: return 'text-slate-400 bg-slate-500/10 border border-slate-500/15'
    }
  }

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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Activity Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Audit user interactions, site synthesis operations, and template use events.</p>
        </div>
        
        <div className="relative w-48">
          <CustomSelect
            value={filter}
            onChange={setFilter}
            options={logFilterOptions}
          />
        </div>
      </div>

      <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden overflow-x-auto glow-cyan">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-[#030612]/30 text-left text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Action Operation</th>
              <th className="p-4">Triggered By</th>
              <th className="p-4">Details Summary</th>
              <th className="p-4 pr-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#030612]/30 transition-all duration-300 text-sm">
                <td className="p-4 pl-6">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getActionColor(log.type)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-white font-bold tracking-wide">{log.user}</td>
                <td className="p-4 text-slate-300 font-light">{log.details}</td>
                <td className="p-4 pr-6 text-right text-slate-400 font-mono text-xs">
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-16 bg-[#080c1e]/40 rounded-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 text-2xl mb-3">
              <ClipboardIcon />
            </div>
            <p className="text-slate-400 font-extrabold">No operations found</p>
            <p className="text-slate-500 text-xs mt-1">We couldn't find any activities registered matching the filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}