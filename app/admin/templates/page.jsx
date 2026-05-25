'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'portfolio',
    html: '',
    css: '',
    thumbnail_url: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    setTemplates(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    if (editingTemplate) {
      // Update existing template
      const { error } = await supabase
        .from('templates')
        .update({
          title: formData.title,
          category: formData.category,
          html: formData.html,
          css: formData.css,
          thumbnail_url: formData.thumbnail_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTemplate.id)

      if (error) {
        alert('Error updating: ' + error.message)
      } else {
        alert('Template updated successfully!')
      }
    } else {
      // Insert new template
      const { error } = await supabase
        .from('templates')
        .insert([{
          title: formData.title,
          category: formData.category,
          html: formData.html,
          css: formData.css,
          thumbnail_url: formData.thumbnail_url,
          created_at: new Date().toISOString()
        }])

      if (error) {
        alert('Error saving: ' + error.message)
      } else {
        alert('Template saved successfully!')
      }
    }

    setSaving(false)
    setShowModal(false)
    resetForm()
    fetchTemplates()
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      title: template.title || '',
      category: template.category || 'portfolio',
      html: template.html || '',
      css: template.css || '',
      thumbnail_url: template.thumbnail_url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (template) => {
    if (confirm(`Delete "${template.title}"? This cannot be undone.`)) {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', template.id)

      if (error) {
        alert('Error deleting: ' + error.message)
      } else {
        alert('Template deleted!')
        fetchTemplates()
      }
    }
  }

  const resetForm = () => {
    setEditingTemplate(null)
    setFormData({
      title: '',
      category: 'portfolio',
      html: '',
      css: '',
      thumbnail_url: ''
    })
  }

  const Modal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#080c1e]/95 backdrop-blur-2xl rounded-3xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#030712]/40">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {editingTemplate ? '✏️ Edit Template' : '✨ Add New Template'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false)
              resetForm()
            }}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300"
              placeholder="e.g., Modern Portfolio"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category *</label>
            <div className="relative">
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition duration-300 appearance-none cursor-pointer"
              >
                <option value="portfolio">Portfolio</option>
                <option value="business">Business</option>
                <option value="restaurant">Restaurant</option>
                <option value="landing">Landing Page</option>
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Thumbnail URL</label>
            <input
              type="text"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">HTML Content *</label>
            <textarea
              required
              rows={10}
              value={formData.html}
              onChange={(e) => setFormData({ ...formData, html: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition duration-300"
              placeholder="<section><h1>{{title}}</h1></section>"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CSS Content</label>
            <textarea
              rows={8}
              value={formData.css}
              onChange={(e) => setFormData({ ...formData, css: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition duration-300"
              placeholder=".section { padding: 60px; }"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
              className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition duration-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="group relative inline-flex items-center justify-center text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-xl" />
              <span className="relative z-10 flex items-center gap-2">
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : editingTemplate ? (
                  'Update Template'
                ) : (
                  'Create Template'
                )}
              </span>
            </button>
          </div>
        </form>
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Template Management</h1>
          <p className="text-slate-400 text-sm mt-1">Configure user starting layouts, landing sites, and categories.</p>
        </div>
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="group relative inline-flex items-center justify-center text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.03] overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300" />
            <span className="relative z-10 flex items-center gap-2 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Template
            </span>
          </button>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/20 shadow-xl transition-all duration-500"
          >
            <div className="relative h-44 bg-[#030612]/80 border-b border-white/5 overflow-hidden flex items-center justify-center">
              {template.thumbnail_url ? (
                <>
                  <img src={template.thumbnail_url} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c1e] via-transparent to-transparent opacity-60" />
                </>
              ) : (
                <div className="text-center p-6 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-2">
                    🎨
                  </div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No Preview Available</p>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-extrabold tracking-wide text-base">{template.title}</h3>
                
                <div className="mt-2.5">
                  {template.category === 'portfolio' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                      📷 Portfolio
                    </span>
                  )}
                  {template.category === 'business' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/15">
                      🏢 Business
                    </span>
                  )}
                  {template.category === 'restaurant' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/15">
                      🍽️ Restaurant
                    </span>
                  )}
                  {template.category === 'landing' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/15">
                      🚀 Landing Page
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleEdit(template)}
                  className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(template)}
                  className="flex items-center gap-1.5 text-red-400 text-xs font-bold hover:text-red-300 transition-all cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {templates.length === 0 && (
        <div className="text-center py-16 bg-[#080c1e]/40 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 text-2xl mb-3">
            📂
          </div>
          <p className="text-slate-400 font-extrabold">No templates yet</p>
          <p className="text-slate-500 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">Click the "+ Add Template" button in the top right to define your very first user canvas starter template.</p>
        </div>
      )}
      
      {showModal && <Modal />}
    </div>
  )
}