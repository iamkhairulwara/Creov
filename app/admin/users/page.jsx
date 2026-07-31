'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

// Icons
const ShieldIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const UserIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const UsersIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)
const ChevronDownIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
)

function RoleDropdown({ user, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (newRole) => {
    onUpdate(user.id, newRole)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#030612]/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-[#030612]/95 hover:border-cyan-500/20 transition-all duration-300 focus:outline-none focus:border-cyan-500"
      >
        {user.role === 'admin' ? 'Admin' : 'Member'}
        <ChevronDownIcon />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-lg bg-[#080c1e] border border-white/10 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleSelect('user')}
              className="w-full text-left px-4 py-2 text-xs text-white hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
              role="menuitem"
            >
              Set as Member
            </button>
            <button
              onClick={() => handleSelect('admin')}
              className="w-full text-left px-4 py-2 text-xs text-white hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
              role="menuitem"
            >
              Set as Admin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  function showToast(message, isError = false) {
    const toast = document.createElement('div')
    toast.innerText = message
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: ${isError ? '#ef4444' : '#06b6d4'};
      color: white; padding: 12px 20px;
      border-radius: 10px; font-size: 13px;
      z-index: 9999; font-family: Inter, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      font-weight: 500;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const { data } = await res.json()
      setUsers(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update role')
      }
      showToast(`Role updated to ${newRole}`)
      fetchUsers()
    } catch (error) {
      showToast('Error updating role: ' + error.message, true)
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
                      <ShieldIcon /> Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/15">
                      <UserIcon /> Member
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
                    <RoleDropdown user={user} onUpdate={updateRole} />
                  </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-[#080c1e]/40 rounded-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 mb-3">
              <UsersIcon />
            </div>
            <p className="text-slate-400 font-extrabold">No matching users</p>
            <p className="text-slate-500 text-xs mt-1">We couldn't find any member matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  )
}