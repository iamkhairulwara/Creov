'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminSubmissions() {
  const [pendingTemplates, setPendingTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  
  // UI states for Rejection Modal
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    fetchPending()
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

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('id, title, category, created_at, html, css, js, profiles:submitted_by(email, full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching pending templates:', error)
      showToast('Error loading submissions', true)
    } else {
      setPendingTemplates(data || [])
    }
    setLoading(false)
  }

  const handleAction = async (templateId, action, reason = '') => {
    setProcessing(templateId)
    try {
      const res = await fetch('/api/admin/templates/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, action, reason })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || `Failed to ${action}`)
      }

      showToast(`Template ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      setPendingTemplates(prev => prev.filter(t => t.id !== templateId))
      
      // Close modal if open
      setRejectingId(null)
      setRejectReason('')

    } catch (error) {
      showToast(error.message, true)
    } finally {
      setProcessing(null)
    }
  }

  const createPreviewHtml = (template) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    *, html, body { margin: 0; padding: 0; box-sizing: border-box; overflow: hidden !important; scrollbar-width: none !important; }
    html, body { -ms-overflow-style: none; }
    body { transform: scale(0.35); transform-origin: top left; width: 286%; min-height: 286%; }
    ${template.css || ''}
  </style>
</head>
<body>${template.html || ''}<script>${template.js || ''}</script></body>
</html>`
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
    <div className="space-y-10 relative">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Template Submissions</h1>
        <p className="text-slate-400 text-sm mt-1">Review, approve, or reject user-submitted layouts for the community marketplace.</p>
      </div>

      {pendingTemplates.length === 0 ? (
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-12 text-center shadow-xl">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-xl font-bold text-white tracking-wide mb-2">You're all caught up!</h2>
          <p className="text-slate-400 text-sm">There are no pending template submissions awaiting review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingTemplates.map(template => (
            <div key={template.id} className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:border-cyan-500/30">
              
              {/* Secure Sandboxed Preview */}
              <div className="relative overflow-hidden border-b border-white/5 bg-[#030610]" style={{ height: '220px' }}>
                <iframe
                  srcDoc={createPreviewHtml(template)}
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  title={template.title}
                  sandbox="allow-scripts" // Strictly isolated, NO allow-same-origin
                />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg bg-yellow-950/80 border border-yellow-500/30 text-yellow-300 backdrop-blur-md shadow-lg shadow-black/50">
                    PENDING REVIEW
                  </span>
                </div>
                
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/60 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 transition-all z-10 shadow-xl"
                  title="Live Preview"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-white text-lg tracking-tight mb-2 truncate">
                  {template.title}
                </h3>
                
                <div className="text-xs text-slate-400 space-y-2 mb-6">
                  <p><strong className="text-slate-300 uppercase tracking-wider text-[10px]">Category:</strong> {template.category}</p>
                  <p><strong className="text-slate-300 uppercase tracking-wider text-[10px]">Submitted By:</strong> {template.profiles?.full_name || template.profiles?.email || 'Unknown User'}</p>
                  <p><strong className="text-slate-300 uppercase tracking-wider text-[10px]">Date:</strong> {new Date(template.created_at).toLocaleDateString()}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                  <button
                    onClick={() => handleAction(template.id, 'approve')}
                    disabled={processing === template.id}
                    className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 disabled:opacity-50"
                  >
                    {processing === template.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setRejectingId(template.id)}
                    disabled={processing === template.id}
                    className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#080c1e] rounded-2xl border border-red-500/20 w-full max-w-md p-6 shadow-2xl relative glow-red">
            <h3 className="text-lg font-bold text-white mb-4">Reject Submission</h3>
            <p className="text-sm text-slate-400 mb-4">Please provide a reason for rejecting this template. The user will see this message.</p>
            
            <textarea
              className="w-full bg-[#030612] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none mb-6"
              rows={4}
              placeholder="e.g. Design does not meet quality standards, or malicious code detected."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectingId(null)
                  setRejectReason('')
                }}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-bold transition duration-300 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(rejectingId, 'reject', rejectReason)}
                disabled={processing === rejectingId || !rejectReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs font-bold transition duration-300 uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
              >
                {processing === rejectingId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#030612]">
            <div>
              <h3 className="text-white font-bold">{previewTemplate.title}</h3>
              <p className="text-slate-400 text-xs mt-1">Live Preview (Sandboxed)</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                sandbox="allow-scripts"
              </span>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-white relative overflow-hidden rounded-b-lg">
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*,html,body{margin:0;padding:0;box-sizing:border-box;} ${previewTemplate.css || ''}</style></head><body>${previewTemplate.html || ''}<script>${previewTemplate.js || ''}</script></body></html>`}
              className="absolute inset-0 w-full h-full border-0"
              title={previewTemplate.title}
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  )
}
