'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function TestTemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase
        .from('templates')
        .select('id, title, category, html,css')

      if (error) {
        setError(error.message)
      } else {
        setTemplates(data)
      }
    }

    fetchTemplates()
  }, [])

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Supabase Templates Test
      </h1>

      {templates.length === 0 ? (
        <p>No templates found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="p-5 border rounded-lg shadow-sm">
              
              <h2 className="text-xl font-semibold mb-2">
                {t.title || 'Untitled Template'}
              </h2>

              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-3">
                {t.category || 'Uncategorized'}
              </span>

              {/* THIS IS THE IMPORTANT BUTTON */}
              <button
                onClick={() => router.push(`/editor?templateId=${t.id}`)}
                className="block w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-900"
              >
                Use Template
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}