'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

const GlobeIcon = () => <svg className="w-16 h-16 mx-auto mb-6 text-slate-400 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('workspaces') // 'workspaces', 'exports', 'submissions'
  const [websites, setWebsites] = useState([])
  const [submittedTemplates, setSubmittedTemplates] = useState([])
  const [exports, setExports] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const [deleting, setDeleting] = useState(null)
  const [websiteToDelete, setWebsiteToDelete] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  async function checkAuthAndLoad() {
    const { data: { session } } = await supabase.auth.getSession()
    let user = session?.user
    
    if (!user) {
      try {
        const cached = localStorage.getItem('creov_cached_user')
        if (cached) user = JSON.parse(cached)
      } catch(e) {}
    }

    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    loadWebsites(user.id)
  }

  async function loadWebsites(userId) {
    // 1. Load Websites (Workspaces)
    const { data: websitesData } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    if (websitesData) setWebsites(websitesData)
    
    // 2. Load Submitted Templates
    const { data: templatesData } = await supabase
      .from('templates')
      .select('id, title, category, status, rejection_reason, created_at, html, css, js')
      .eq('submitted_by', userId)
      .eq('is_user_submitted', true)
      .order('created_at', { ascending: false })
    if (templatesData) setSubmittedTemplates(templatesData)

    // 3. Load Exports (Join with websites to get title if available)
    const { data: exportsData } = await supabase
      .from('exports')
      .select('id, export_type, exported_at, websites(id, title)')
      .eq('user_id', userId)
      .order('exported_at', { ascending: false })
    if (exportsData) setExports(exportsData)

    setLoading(false)
  }

  function handleDelete(websiteId) {
    const website = websites.find(w => w.id === websiteId)
    setWebsiteToDelete(website)
  }

  async function confirmDelete(websiteId) {
    setDeleting(websiteId)

    // Delete related prompts first to avoid foreign key conflict
    await supabase.from('prompts').delete().eq('website_id', websiteId)

    // Delete related exports
    await supabase.from('exports').delete().eq('website_id', websiteId)

    // Now delete the website
    const { error } = await supabase.from('websites').delete().eq('id', websiteId)

    if (!error) {
      setWebsites(prev => prev.filter(w => w.id !== websiteId))
    }

    setDeleting(null)
    setWebsiteToDelete(null)
  }

  function handleEdit(website) {
    localStorage.setItem('edit_website', JSON.stringify(website))
    router.push(`/editor/${website.id}`)
  }

  function handlePreview(website) {
    const full = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n<style>${website.css || ''}</style>\n</head>\n<body>\n${website.html || ''}\n<script>${website.js || ''}</script>\n</body>\n</html>`
    const blob = new Blob([full], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  function handleExport(website) {
    localStorage.setItem('export_website', JSON.stringify({
      id: website.id,
      html: website.html,
      css: website.css,
      js: website.js,
      title: website.title || 'my-website'
    }))
    router.push('/export')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const DeleteConfirmModal = () => {
    if (!websiteToDelete) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
        <div className="bg-[#030712] rounded-2xl border border-white/10 w-full max-w-sm p-6 shadow-2xl relative">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Delete Website?
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Are you sure you want to delete <span className="text-white font-bold">"{websiteToDelete.title || 'Untitled Workspace'}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setWebsiteToDelete(null)}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-sm font-bold transition duration-300"
              disabled={deleting === websiteToDelete.id}
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDelete(websiteToDelete.id)}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 text-sm font-bold transition duration-300 flex items-center gap-2 disabled:opacity-50"
              disabled={deleting === websiteToDelete.id}
            >
              {deleting === websiteToDelete.id && <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />}
              {deleting === websiteToDelete.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-[85rem] mx-auto px-4 sm:px-8 pt-32 pb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Sidebar Navigation */}
            <div className="lg:w-64 shrink-0 flex flex-col gap-2">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-3 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active Hub
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-space-grotesk)]">Dashboard</h1>
              </div>

              <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
                <button
                  onClick={() => setActiveTab('workspaces')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                    activeTab === 'workspaces' 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  My Workspaces
                  <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{websites.length}</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('exports')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                    activeTab === 'exports' 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Exported Projects
                  <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{exports.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('published')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                    activeTab === 'published' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Published Sites
                  <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{websites.filter(w => w.slug).length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                    activeTab === 'submissions' 
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  Submitted Templates
                  <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{submittedTemplates.length}</span>
                </button>
              </nav>

              <div className="mt-8 hidden lg:block border-t border-white/5 pt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/generate" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#030712] bg-cyan-500 hover:bg-cyan-400 shadow-[0_4px_20px_rgba(34,211,238,0.2)] transition-all">
                    + Generate AI Site
                  </Link>
                  <Link href="/templates" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    Browse Templates
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              
              {/* Skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 animate-pulse">
                      <div className="h-32 bg-white/5 rounded-2xl mb-4" />
                      <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                      <div className="h-3 bg-white/5 rounded w-1/3 mb-6" />
                      <div className="h-10 bg-white/5 rounded-xl" />
                    </div>
                  ))}
                </div>
              )}

              {/* -------------------- TAB: WORKSPACES & PUBLISHED -------------------- */}
              {!loading && (activeTab === 'workspaces' || activeTab === 'published') && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                      {activeTab === 'workspaces' ? 'My Workspaces' : 'Published Sites'}
                    </h2>
                  </div>
                  
                  {(() => {
                    const displayWebsites = activeTab === 'workspaces' ? websites : websites.filter(w => w.slug);
                    if (displayWebsites.length === 0) {
                      return (
                        <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
                          <GlobeIcon />
                          <h3 className="text-xl font-bold text-white mb-2">
                            {activeTab === 'workspaces' ? 'No active workspaces' : 'No published sites yet'}
                          </h3>
                          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                            {activeTab === 'workspaces' 
                              ? 'Start by generating a new site with AI or picking a template.'
                              : 'AI Generated websites that are assigned a public URL will appear here.'}
                          </p>
                          <Link href="/generate" className="inline-flex px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#030712] bg-cyan-500 hover:bg-cyan-400 transition-all">
                            {activeTab === 'workspaces' ? 'Create Workspace' : 'Generate Site'}
                          </Link>
                        </div>
                      )
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {displayWebsites.map(website => (
                          <div key={website.id} className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-cyan-500/20 hover:shadow-xl hover:scale-[1.01]">
                            <div className="relative overflow-hidden cursor-pointer border-b border-white/5" style={{ height: '160px', background: '#0a0f23' }} onClick={() => handlePreview(website)}>
                              <iframe srcDoc={`<html><head><style>*{margin:0;padding:0;overflow:hidden;}body{transform:scale(0.45);transform-origin:top left;width:222%;height:222%;overflow:hidden;}${website.css || ''}</style></head><body>${website.html || ''}</body></html>`} className="w-full h-full border-0 pointer-events-none transition-transform duration-500 group-hover:scale-105" title={website.title}/>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80">
                                <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#030712] bg-cyan-500 rounded-xl">Live View</span>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-bold text-white truncate text-base mb-1">{website.title || 'Untitled'}</h3>
                              <p className="text-[10px] uppercase font-mono text-slate-500 mb-4">EDITED {formatDate(website.updated_at || website.created_at)}</p>
                              
                              {activeTab === 'published' && website.slug && (
                                <div className="mb-4 bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                  <Link href={`/p/${website.slug}`} target="_blank" className="text-xs font-mono text-green-300 hover:text-green-200 transition-colors truncate">
                                    creov.app/p/{website.slug}
                                  </Link>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleEdit(website)} className="py-2.5 rounded-xl text-xs font-bold uppercase bg-white/5 hover:bg-white/10 transition-all">Edit</button>
                                <button onClick={() => handleExport(website)} className="py-2.5 rounded-xl text-xs font-bold uppercase bg-white/5 hover:bg-cyan-500 hover:text-black transition-all">Export</button>
                                {website.slug ? (
                                  <>
                                    <button onClick={() => handlePreview(website)} className="py-2.5 rounded-xl text-xs font-bold uppercase border border-white/5 hover:bg-white/5 transition-all">Preview</button>
                                    <Link href={`/p/${website.slug}`} target="_blank" className="flex items-center justify-center py-2.5 rounded-xl text-xs font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">Live Link</Link>
                                  </>
                                ) : (
                                  <button onClick={() => handlePreview(website)} className="col-span-2 py-2.5 rounded-xl text-xs font-bold uppercase border border-white/5 hover:bg-white/5 transition-all">Preview Code</button>
                                )}
                                <button onClick={() => handleDelete(website.id)} className="col-span-2 py-2.5 rounded-xl text-xs font-bold uppercase text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all">Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* -------------------- TAB: EXPORTS -------------------- */}
              {!loading && activeTab === 'exports' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Export History</h2>
                  </div>

                  {exports.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
                      <svg className="w-12 h-12 mx-auto mb-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <h3 className="text-xl font-bold text-white mb-2">No exported projects</h3>
                      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">When you download your websites as ZIP or HTML, they will appear here as a backup.</p>
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4 font-bold">Project Name</th>
                            <th className="px-6 py-4 font-bold">Format</th>
                            <th className="px-6 py-4 font-bold text-right">Export Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {exports.map((exp, idx) => (
                            <tr key={exp.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                </div>
                                {exp.websites ? exp.websites.title : 'Deleted Workspace'}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                                  {exp.export_type || 'ZIP'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400 text-right font-mono text-xs">
                                {formatDate(exp.exported_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- TAB: SUBMISSIONS -------------------- */}
              {!loading && activeTab === 'submissions' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Submitted Templates</h2>
                  </div>

                  {submittedTemplates.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
                      <svg className="w-12 h-12 mx-auto mb-4 text-violet-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      <h3 className="text-xl font-bold text-white mb-2">No community submissions</h3>
                      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">Share your beautiful designs with thousands of other creators.</p>
                      <Link href="/templates/submit" className="inline-flex px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-500 transition-all">
                        Submit a Template
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {submittedTemplates.map(template => (
                        <div key={template.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-white truncate mr-2">{template.title}</h3>
                            {template.status === 'approved' && <span className="px-2 py-1 text-[9px] font-black uppercase rounded bg-green-500/10 text-green-400 border border-green-500/20">Approved</span>}
                            {template.status === 'pending' && <span className="px-2 py-1 text-[9px] font-black uppercase rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pending</span>}
                            {template.status === 'rejected' && <span className="px-2 py-1 text-[9px] font-black uppercase rounded bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>}
                          </div>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-4">{template.category} • {formatDate(template.created_at)}</p>
                          
                          {template.status === 'rejected' && template.rejection_reason && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-xs text-red-300 border border-red-500/20">
                              <strong className="block text-red-400 mb-1">Reason:</strong> {template.rejection_reason}
                            </div>
                          )}
                          
                          {template.status === 'approved' && (
                            <Link href="/templates" className="inline-block text-center w-full py-2.5 rounded-xl text-xs font-bold uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all">
                              View in Marketplace
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
      <DeleteConfirmModal />
    </div>
  )
}