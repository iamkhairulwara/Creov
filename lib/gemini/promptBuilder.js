export function buildPrompt(userPrompt, intent) {
  const sections = intent.sections || ['header', 'hero', 'about', 'services', 'contact', 'footer'];
  const industry = intent.industry || 'business';
  const style = intent.style || 'modern';
  const colors = intent.colors || [];

  // DYNAMIC STYLE CONFIGURATION BASED ON PROMPT
  const styleConfigs = {
    // Professional / Corporate
    professional: {
      theme: 'Corporate Elegance',
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3b82f6',
      cta: '#2563eb',
      text: '#f1f5f9',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontHeading: 'Inter, -apple-system, sans-serif',
      fontBody: 'Inter, system-ui, sans-serif',
      cardStyle: 'border: 1px solid rgba(59,130,246,0.2); background: rgba(15,23,42,0.8)',
      buttonStyle: 'rounded-lg',
      animationIntensity: 'subtle'
    },
    
    // Modern / Minimal
    modern: {
      theme: 'Clean Modern',
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#06b6d4',
      cta: '#0891b2',
      text: '#0f172a',
      gradient: 'linear-gradient(120deg, #ffffff 0%, #f1f5f9 100%)',
      fontHeading: 'Outfit, -apple-system, sans-serif',
      fontBody: 'DM Sans, system-ui, sans-serif',
      cardStyle: 'background: white; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.1)',
      buttonStyle: 'rounded-full',
      animationIntensity: 'medium'
    },
    
    // Colorful / Vibrant
    colorful: {
      theme: 'Vibrant Creative',
      primary: '#5e2ca5',
      secondary: '#ff6b6b',
      accent: '#feca57',
      cta: '#ff9f43',
      text: '#2d3436',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      fontHeading: 'Poppins, -apple-system, sans-serif',
      fontBody: 'Poppins, system-ui, sans-serif',
      cardStyle: 'background: rgba(255,255,255,0.95); border: 2px solid rgba(255,107,107,0.2)',
      buttonStyle: 'rounded-xl',
      animationIntensity: 'bold'
    },
    
    // Dark / Premium
    dark: {
      theme: 'Dark Premium',
      primary: '#0a0a0a',
      secondary: '#1a1a2e',
      accent: '#e94560',
      cta: '#e94560',
      text: '#eeeeee',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      fontHeading: 'Playfair Display, Georgia, serif',
      fontBody: 'Josefin Sans, system-ui, sans-serif',
      cardStyle: 'background: rgba(26,26,46,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(233,69,96,0.2)',
      buttonStyle: 'rounded-md',
      animationIntensity: 'subtle'
    },
    
    // Elegant / Luxury
    elegant: {
      theme: 'Luxury Elegance',
      primary: '#1a120b',
      secondary: '#2c2418',
      accent: '#c4a747',
      cta: '#c4a747',
      text: '#f5f0e8',
      gradient: 'linear-gradient(135deg, #1a120b 0%, #2c2418 50%, #3d3020 100%)',
      fontHeading: 'Cormorant Garamond, Georgia, serif',
      fontBody: 'Montserrat, system-ui, sans-serif',
      cardStyle: 'background: rgba(44,36,24,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(196,167,71,0.3)',
      buttonStyle: 'rounded-none border-2',
      animationIntensity: 'soft'
    },
    
    // Default fallback
    default: {
      theme: 'Modern Professional',
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#06b6d4',
      cta: '#0891b2',
      text: '#f1f5f9',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontHeading: 'Inter, sans-serif',
      fontBody: 'Inter, system-ui, sans-serif',
      cardStyle: 'background: rgba(255,255,255,0.05); backdrop-filter: blur(10px)',
      buttonStyle: 'rounded-lg',
      animationIntensity: 'medium'
    }
  };

  // Select style config based on intent
  let selectedStyle = styleConfigs[style] || styleConfigs.modern;
  
  // Override with color palette if specified
  if (colors.length > 0) {
    selectedStyle.accent = colors[0];
    selectedStyle.cta = colors[0];
  }

  const sectionList = sections.map(s => `<section id="${s}">`).join(', ');
  const animationIntensity = selectedStyle.animationIntensity;

  return `You are a world-class UI/UX designer and frontend developer. Create a STUNNING, PROFESSIONAL, RESPONSIVE single-page website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 USER REQUEST: "${userPrompt}"
🏭 INDUSTRY: ${industry}
🎨 STYLE: ${style.toUpperCase()} — ${selectedStyle.theme}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

═══════════════════════════════════════════════════
🎨 DESIGN SYSTEM (${selectedStyle.theme} Theme)
═══════════════════════════════════════════════════

CSS VARIABLES (use these exactly):
:root {
  --primary: ${selectedStyle.primary};
  --secondary: ${selectedStyle.secondary};
  --accent: ${selectedStyle.accent};
  --cta: ${selectedStyle.cta};
  --text: ${selectedStyle.text};
  --bg: var(--primary);
  --card-bg: ${selectedStyle.cardStyle.includes('backdrop') ? 'rgba(255,255,255,0.05)' : '#ffffff'};
  --border-radius-card: ${selectedStyle.buttonStyle === 'rounded-xl' ? '1rem' : '0.75rem'};
}

TYPOGRAPHY:
- Heading font: '${selectedStyle.fontHeading.split(',')[0]}', ${selectedStyle.fontHeading.includes('serif') ? 'serif' : 'sans-serif'}
- Body font: '${selectedStyle.fontBody.split(',')[0]}', system-ui, sans-serif
- Import these from Google Fonts
- Hero heading: clamp(3.5rem, 8vw, 6rem) with letter-spacing: -0.02em
- Subheading: clamp(1.2rem, 3vw, 1.5rem) with opacity: 0.9

BACKGROUND:
- Main gradient: ${selectedStyle.gradient}
- Add subtle noise texture: use background-image: repeating-linear-gradient or SVG pattern
- Hero overlay: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)

COLOR SCHEME SPECIFICS:
${style === 'colorful' ? `
- Use vibrant gradients on buttons and cards
- Add color transitions on hover
- Use split-complementary color scheme
- Icons should have gradient fills` : ''}
${style === 'dark' ? `
- High contrast between elements
- Use subtle glows on hover (box-shadow with accent color)
- Metallic or neon accents` : ''}
${style === 'elegant' ? `
- Gold/bronze accents (#c4a747)
- Use serif fonts for headings
- Subtle borders and shadows
- Marble or velvet texture feel` : ''}
${style === 'professional' ? `
- Blue/corporate color scheme
- Clean sharp edges
- Professional spacing and alignment` : ''}

═══════════════════════════════════════════════════
🎨 VISUAL ENHANCEMENTS
═══════════════════════════════════════════════════

CARDS & COMPONENTS:
- Cards: ${selectedStyle.cardStyle}
- Border radius: ${selectedStyle.buttonStyle === 'rounded-full' ? '2rem' : selectedStyle.buttonStyle === 'rounded-xl' ? '1rem' : '0.75rem'}
- Cards have hover effect: transform: translateY(-8px) + enhanced shadow
- Buttons: ${selectedStyle.buttonStyle}, padding: 0.8rem 2rem, font-weight: 600
- Button hover: transform: translateY(-2px), filter: brightness(1.05)

ANIMATIONS (${animationIntensity} intensity):
${animationIntensity === 'bold' ? `
- Staggered fade-in for all elements (0.1s delay increments)
- Shimmer effect on buttons (gradient sweep)
- Parallax scroll effect on hero
- Rotating geometric shapes in background` : ''}
${animationIntensity === 'medium' ? `
- Fade-up animation for sections (0.3s ease)
- Hover pulse effect on CTAs
- Smooth scroll-triggered reveals` : ''}
${animationIntensity === 'subtle' ? `
- Gentle fade-in only
- Soft hover transitions
- Elegant underline animations` : ''}

- All animations must use CSS @keyframes only
- Add will-change: transform for performance
- Respect prefers-reduced-motion

═══════════════════════════════════════════════════
📱 RESPONSIVE & INTERACTIVE
═══════════════════════════════════════════════════

NAVIGATION:
- Fixed navbar with backdrop-filter: blur(12px) on scroll
- Logo: use industry-appropriate SVG or text
- Mobile: hamburger menu with smooth slide-in
- Active section highlight in nav

SECTION REQUIREMENTS (${sections.join(' → ')}):
${sections.map(s => `- ${s}: full content, not empty — write REAL text for a ${industry} business`).join('\n')}

FOOTER:
- Multi-column (company, links, social, newsletter)
- Copyright year dynamically via JavaScript
- Social icons with hover effects

MOBILE FIRST (breakpoints: 768px, 1024px):
- Grid: repeat(auto-fit, minmax(280px, 1fr))
- Typography scales down on mobile
- Touch targets minimum 44px
- No horizontal scroll

═══════════════════════════════════════════════════
🚫 STRICT RULES (VIOLATION = FAILURE)
═══════════════════════════════════════════════════

1. ❌ NO href="page.html" or href="/path" — INSTANT FAILURE
2. ✅ ONLY href="#section-id" for ALL navigation links
3. ✅ ALL content in ONE HTML file — no external pages
4. ✅ Navigation: ${sectionList}
5. ✅ html { scroll-behavior: smooth; }
6. ❌ NO placeholder text — write REAL, MEANINGFUL content for ${industry}

═══════════════════════════════════════════════════
🎯 CONTENT REQUIREMENTS
═══════════════════════════════════════════════════

- Hero: powerful headline, compelling subheadline, 2 CTAs (primary + secondary)
- Services/Features: 3-6 cards with icons, titles, descriptions specific to ${industry}
- About: company story, values, team member cards (2-3 people)
- Testimonials: 2-3 quotes from satisfied clients (realistic names)
- Contact: form with name, email, message + map placeholder
- Images: use https://picsum.photos/ for placeholders with relevant IDs
- Icons: inline SVGs (Font Awesome CDN acceptable)

═══════════════════════════════════════════════════
📦 OUTPUT FORMAT
═══════════════════════════════════════════════════

- Return ONLY the HTML — no markdown, no explanations
- Start with <!DOCTYPE html>, end with </html>
- ALL CSS in <style> tag in <head>
- ALL JS in <script> tag before </body>
- Minimum 400 lines of quality code
- Make it look like a \$15,000 agency website

The website must be EXTRAORDINARY — award-winning design that perfectly matches "${userPrompt}". GO.`;
}