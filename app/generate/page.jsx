'use client'
import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'

const suggestions = [
  "A portfolio website for a graphic designer with dark theme",
  "A restaurant website with menu and reservation section",
  "A business landing page for a software agency",
  "A personal blog with minimal white design",
]

export default function Generate() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    // Gemini API call will be added when Person B finishes backend
    console.log('Generating for prompt:', prompt)
    setTimeout(() => setLoading(false), 2000) // placeholder
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Generate your website
          </h1>
          <p className="text-gray-500">
            Describe what you want and AI will build it for you
          </p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website... e.g. A portfolio for a UI/UX designer with dark theme and smooth animations"
            rows={5}
            className="w-full text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {prompt.length} characters
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Website'
              )}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
            Try these examples
          </p>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}