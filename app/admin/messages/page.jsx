'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m))
    }
  }

  const handleReplyGmail = (msg) => {
    // Mark as read automatically when replying
    if (msg.status === 'unread') {
      handleStatusChange(msg.id, 'read')
    }

    const subject = encodeURIComponent(`Re: ${msg.subject}`)
    const body = encodeURIComponent(`\n\n\n--- Original Message from ${msg.name} ---\n${msg.message}`)
    
    // Gmail Compose URL format
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${subject}&body=${body}`
    
    window.open(gmailUrl, '_blank')
  }

  const handleDelete = (id) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    const id = deleteConfirmId
    setDeleteConfirmId(null)

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (!error) {
      setMessages(messages.filter(m => m.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">Inbox</h1>
          <p className="text-slate-400 mt-1">Manage and reply to contact form submissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
            Total: {messages.length}
          </span>
          <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            Unread: {messages.filter(m => m.status === 'unread').length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-slate-400 font-mono text-sm uppercase">No messages yet.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`p-6 rounded-2xl border transition-all duration-300 ${msg.status === 'unread' ? 'bg-blue-500/[0.02] border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                    <h2 className="text-lg font-bold text-white truncate">{msg.subject}</h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                    <span className="font-semibold text-slate-300">{msg.name}</span>
                    <span className="opacity-50">•</span>
                    <a href={`mailto:${msg.email}`} className="hover:text-blue-400 transition-colors">{msg.email}</a>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-[#0a0f24] border border-white/5 text-slate-300 text-sm whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => handleReplyGmail(msg)}
                    className="px-4 py-2 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"/><line x1="6" y1="10" x2="7" y2="10"/></svg>
                    Reply in Gmail
                  </button>

                  {msg.status === 'unread' ? (
                    <button
                      onClick={() => handleStatusChange(msg.id, 'read')}
                      className="px-4 py-2 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all text-center"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(msg.id, 'unread')}
                      className="px-4 py-2 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider transition-all text-center"
                    >
                      Mark Unread
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="px-4 py-2 w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-all text-center mt-auto"
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0f24] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(239,68,68,0.1)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Message?</h3>
            <p className="text-slate-400 mb-8">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-[0_4px_20px_rgba(239,68,68,0.3)]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
