'use client'

export default function CreovLogo({ className = "w-9 h-9", iconOnly = false, suffix = "" }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Premium SVG Icon Container */}
      <div 
        className={`${className} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-600/10 border border-white/10 transition-all duration-500 group-hover:border-cyan-400/30 group-hover:scale-105 group-hover:rotate-6`}
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 12px rgba(255,255,255,0.05)'
        }}
      >
        {/* Ambient neon backing glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
        
        {/* Layered Custom SVG Drawing */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="p-1.5 relative z-10"
        >
          <defs>
            <linearGradient id="creovGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          {/* Outer Geometric 'C' Shape */}
          <path 
            d="M24 8.5C21.8 6.3 18.8 5 15.5 5C9.15 5 4 10.15 4 16.5C4 22.85 9.15 28 15.5 28C18.8 28 21.8 26.7 24 24.5" 
            stroke="url(#creovGrad)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-all duration-500 group-hover:stroke-cyan-300"
          />

          {/* AI Core Sparks inside the 'C' */}
          <path 
            d="M17 16.5L20 12L23 16.5H20L17 21" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-0.5"
          />
          
          {/* Spark dots represent code synthesis */}
          <circle 
            cx="25" 
            cy="16.5" 
            r="1.5" 
            fill="#a855f7" 
            className="animate-pulse" 
          />
        </svg>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <span className="text-white font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent transition-all duration-300 group-hover:text-white flex items-center gap-2">
          Creov
          {suffix && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {suffix}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
