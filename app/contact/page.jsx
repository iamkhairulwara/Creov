'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        subject: e.target.subject.value,
        message: e.target.message.value
      }

      const { error } = await supabase
        .from('contact_messages')
        .insert([formData])

      if (error) {
        console.error('Error sending message:', error.message)
        alert('Failed to send message: ' + error.message)
      } else {
        setIsSent(true)
        e.target.reset()
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-950/20 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                Contact Us
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Let's <span className="text-blue-400">Talk</span>
            </h1>
            <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
              Have a question, feedback, or need support? Drop us a message and our team will get back to you shortly.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            
            {isSent ? (
              <div className="text-center py-12 relative z-10">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                <p className="text-slate-400">Thanks for reaching out. We'll be in touch soon.</p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-8 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      className="bg-[#0a0f24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      className="bg-[#0a0f24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    required
                    className="bg-[#0a0f24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="bg-[#0a0f24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.4)] flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
