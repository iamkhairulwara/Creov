import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SessionTimeout from "@/components/SessionTimeout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Creov",
  description: "AI Powered Website Builder",
  icons: {
    icon: '/favicon.svg',
  }
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
      <body className="bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-50">
        <SessionTimeout timeoutMinutes={30} />
        {/* Subtle global grain texture overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-screen">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  )
}
