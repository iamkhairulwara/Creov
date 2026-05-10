'use client'

import { useEffect } from 'react'
import Navbar from '@/components/ui/NAVBAR'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function Home() {
// supabase debug code 
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase.from('templates').select('*')

      if (error) {
        console.log('❌ Supabase Error:', error.message)
      } else {
        console.log('✅ Supabase Connected!')
        console.log('Templates:', data)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl font-bold text-black mb-6">
          Build Websites with <br />
          <span className="text-gray-500">AI in Seconds</span>
        </h1>

        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Describe your website or pick a template.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/generate" className="bg-black text-white px-6 py-3 rounded-lg">
            Generate
          </Link>

          <Link href="/templates" className="border px-6 py-3 rounded-lg">
            Templates
          </Link>
        </div>

      </section>
    </div>
  )
}