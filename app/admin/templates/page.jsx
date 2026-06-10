'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const PaletteIcon = ({className="w-6 h-6"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const FolderIcon = ({className="w-6 h-6"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
const CameraIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
const BuildingIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
const UtensilsIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
const RocketIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const SparklesIcon = ({className="w-5 h-5 inline-block mr-1"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
const EditIcon = ({className="w-5 h-5 inline-block mr-1"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const ShoppingCartIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>

import CustomSelect from '@/components/ui/CustomSelect'

const templateCategoryOptions = [
  { value: 'portfolio', label: 'Portfolio', icon: <CameraIcon /> },
  { value: 'business', label: 'Business', icon: <BuildingIcon /> },
  { value: 'restaurant', label: 'Restaurant', icon: <UtensilsIcon /> },
  { value: 'landing', label: 'Landing Page', icon: <RocketIcon /> },
  { value: 'e-commerce', label: 'E-Commerce', icon: <ShoppingCartIcon /> }
]

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
          thumbnail_url: formData.thumbnail_url
        })
        .eq('id', editingTemplate.id)

      if (error) {
        showToast('Error updating: ' + error.message, true)
      } else {
        showToast('Template updated successfully!')
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
        showToast('Error saving: ' + error.message, true)
      } else {
        showToast('Template saved successfully!')
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
        showToast('Error deleting: ' + error.message, true)
      } else {
        showToast('Template deleted!')
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
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
            {editingTemplate ? <><EditIcon /> Edit Template</> : <><SparklesIcon /> Add New Template</>}
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
            <div className="relative z-40">
              <CustomSelect
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={templateCategoryOptions}
              />
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
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                    <PaletteIcon />
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
                      <CameraIcon /> Portfolio
                    </span>
                  )}
                  {template.category === 'business' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/15">
                      <BuildingIcon /> Business
                    </span>
                  )}
                  {template.category === 'restaurant' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/15">
                      <UtensilsIcon /> Restaurant
                    </span>
                  )}
                  {template.category === 'landing' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/15">
                      <RocketIcon /> Landing Page
                    </span>
                  )}
                  {template.category === 'e-commerce' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/15">
                      <ShoppingCartIcon /> E-Commerce
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
          <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 mb-3">
            <FolderIcon />
          </div>
          <p className="text-slate-400 font-extrabold">No templates yet</p>
          <p className="text-slate-500 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">Click the "+ Add Template" button in the top right to define your very first user canvas starter template.</p>
        </div>
      )}
      
      {showModal && <Modal />}
    </div>
  )
}