'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    setUsers(data || [])
    setLoading(false)
  }

  const updateRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert('Error updating role: ' + error.message)
    } else {
      alert(`Role updated to ${newRole}`)
      fetchUsers()
    }
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">Review profiles, assign administrator roles, and view user metadata.</p>
        </div>
        
        {/* Search Input Container */}
        <div className="relative w-full md:w-96 shadow-lg">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300 text-sm"
          />
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Users Database Grid */}
      <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden overflow-x-auto glow-cyan">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-[#030612]/30 text-left text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Profile</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role Badge</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[#030612]/30 transition-all duration-300 text-sm">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center text-cyan-300 font-extrabold text-xs shadow-inner">
                      {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-white font-bold tracking-wide">{user.full_name || '—'}</span>
                  </div>
                 </td>
                <td className="p-4 text-slate-300 font-light">{user.email}</td>
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.05)]">
                      ⚡ Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/15">
                      👤 Member
                    </span>
                  )}
                 </td>
                <td className="p-4 text-slate-400 font-mono text-xs">
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                 </td>
                <td className="p-4 pr-6 text-right">
                  <div className="inline-block relative">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="bg-[#030612]/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-[#030612]/95 hover:border-cyan-500/20 transition-all duration-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="user">Set as Member</option>
                      <option value="admin">Set as Admin</option>
                    </select>
                  </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-[#080c1e]/40 rounded-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 text-2xl mb-3">
              👥
            </div>
            <p className="text-slate-400 font-extrabold">No matching users</p>
            <p className="text-slate-500 text-xs mt-1">We couldn't find any member matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  )
}