'use client'
import { useState, useRef, useEffect } from 'react'

export default function CustomSelect({ value, onChange, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0] || { label: 'Select...' }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-all font-semibold text-sm cursor-pointer shadow-lg hover:bg-white/10"
      >
        <span className="flex items-center gap-2 text-cyan-400">
          {selectedOption.icon}
          {selectedOption.label}
        </span>
        <svg
          className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-[#080c1e]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_8px_30px_rgba(6,182,212,0.15)] overflow-hidden animate-fade-in origin-top" style={{ minWidth: 'max-content' }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-colors ${value === option.value ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`}
            >
              {option.icon ? (
                <span className={`flex-shrink-0 ${value === option.value ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {option.icon}
                </span>
              ) : null}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
