'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import CustomSelect from '@/components/ui/CustomSelect'

const AiFastIcon = () => <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded bg-cyan-500/20 text-cyan-400">⚡</span>
const AiQualityIcon = () => <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded bg-purple-500/20 text-purple-400">✨</span>

const aiModelOptions = [
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)', icon: <AiFastIcon /> },
  { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro (Quality)', icon: <AiQualityIcon /> }
]

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Creov',
    maintenanceMode: false,
    allowSignup: true,
    maxGenerationsPerDay: 10,
    aiModel: 'gemini-2.0-flash',
    generationTimeout: 60
  })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Load settings from localStorage or Supabase
  useEffect(() => {
    const saved = localStorage.getItem('admin_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
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

  const saveSettings = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('admin_settings', JSON.stringify(settings))
    setSaving(false)
    showToast('Settings saved successfully!')
  }

  const tabs = [
    { 
      id: 'general', 
      name: 'General', 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    },
    { 
      id: 'ai', 
      name: 'AI Configuration', 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      )
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    { 
      id: 'api', 
      name: 'API Keys', 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5l-3-3"/>
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure platform behavior, default timeouts, and AI engines.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-bold border ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl glow-cyan">
            <h2 className="text-lg font-bold text-white tracking-wide mb-6">General Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full md:w-96 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Maintenance Mode</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-light">Show maintenance page to all users and restrict layout generation.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`w-12 h-6.5 rounded-full transition-all duration-300 p-0.5 ${
                    settings.maintenanceMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border border-white/5'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-white transition-all duration-300 transform shadow-md ${
                    settings.maintenanceMode ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Allow New Signups</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-light">Enable or disable user registration actions across authentication forms.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, allowSignup: !settings.allowSignup })}
                  className={`w-12 h-6.5 rounded-full transition-all duration-300 p-0.5 ${
                    settings.allowSignup ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border border-white/5'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-white transition-all duration-300 transform shadow-md ${
                    settings.allowSignup ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Max Generations Per User / Day</label>
                <input
                  type="number"
                  value={settings.maxGenerationsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxGenerationsPerDay: parseInt(e.target.value) })}
                  className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300 text-sm font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Configuration */}
      {activeTab === 'ai' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl glow-cyan">
            <h2 className="text-lg font-bold text-white tracking-wide mb-6">AI Model Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Primary AI Model</label>
                <div className="relative w-full md:w-96 z-50">
                  <CustomSelect
                    value={settings.aiModel}
                    onChange={(val) => setSettings({ ...settings, aiModel: val })}
                    options={aiModelOptions}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Generation Timeout (seconds)</label>
                <input
                  type="number"
                  value={settings.generationTimeout}
                  onChange={(e) => setSettings({ ...settings, generationTimeout: parseInt(e.target.value) })}
                  className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300 text-sm font-bold"
                />
                <p className="text-slate-500 text-xs mt-1.5 font-light">Maximum wait time allowed for AI engine synthesis response.</p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl glow-purple">
            <h2 className="text-lg font-bold text-white tracking-wide mb-6">AI Usage Summary</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-5 rounded-2xl border border-white/5 bg-[#030612]/30 hover:border-cyan-500/10 transition-all duration-300">
                <p className="text-3xl font-black text-cyan-400 tracking-tight">1,247</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Total Calls</p>
              </div>
              <div className="text-center p-5 rounded-2xl border border-white/5 bg-[#030612]/30 hover:border-cyan-500/10 transition-all duration-300">
                <p className="text-3xl font-black text-green-400 tracking-tight">94.5%</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Success Rate</p>
              </div>
              <div className="text-center p-5 rounded-2xl border border-white/5 bg-[#030612]/30 hover:border-cyan-500/10 transition-all duration-300">
                <p className="text-3xl font-black text-yellow-400 tracking-tight">26.4s</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Avg Response</p>
              </div>
              <div className="text-center p-5 rounded-2xl border border-white/5 bg-[#030612]/30 hover:border-cyan-500/10 transition-all duration-300">
                <p className="text-3xl font-black text-purple-400 tracking-tight">~$12.50</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Est. Cost (Month)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl glow-cyan">
            <h2 className="text-lg font-bold text-white tracking-wide mb-6">Security Configuration</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Two-Factor Authentication (Admin)</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-light">Require dynamic auth validation codes for all administrator session queries.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/15">
                  Coming Soon
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Rate Limiting Protection</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-light">Enforce automated API query caps on multiple concurrent requests per client IP.</p>
                </div>
                <button className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10 hover:text-white transition duration-300">
                  Configure
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Allowed HTML Tags (Whitelist)</label>
                <textarea
                  rows={3}
                  defaultValue="div, section, header, footer, nav, h1, h2, h3, p, a, img, button, span, ul, li"
                  className="w-full max-w-2xl px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition duration-300 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#080c1e]/60 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl glow-cyan">
            <h2 className="text-lg font-bold text-white tracking-wide mb-6">API Configuration</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Gemini API Key</label>
                <div className="flex gap-2 max-w-2xl">
                  <input
                    type="password"
                    value="••••••••••••••••••••••••"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 focus:outline-none text-sm"
                    disabled
                  />
                  <button className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition duration-300">Update</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Supabase Service Role Key</label>
                <div className="flex gap-2 max-w-2xl">
                  <input
                    type="password"
                    value="••••••••••••••••••••••••"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 focus:outline-none text-sm"
                    disabled
                  />
                  <button className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition duration-300">Update</button>
                </div>
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wide mt-2.5 flex items-center gap-1">
                  <span>⚠️</span> Never share or expose this service role token in static code files.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="group relative inline-flex items-center justify-center text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save All Settings'
            )}
          </span>
        </button>
      </div>
    </div>
  )
}