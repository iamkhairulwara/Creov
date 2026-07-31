// ─────────────────────────────────────────────────────────────────────────────
// buildPrompt.js  —  Elevated Prompt Builder for AI Website Generator
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. DETERMINISTIC SEED  ─────────────────────────────────────────────────
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

// ── 2. COLOR PALETTES  ────────────────────────────────────────────────────
const PALETTES = [
  { name: "Deep Ocean", bg: "#0a0f1e", surface: "#0f1a2e", accent: "#00d4ff", cta: "#0099cc", text: "#e8f4ff", muted: "#7ba3c0", highlight: "#00ffcc" },
  { name: "Crimson Night", bg: "#0d0608", surface: "#1a0810", accent: "#e63946", cta: "#c1121f", text: "#fff1ee", muted: "#b88a8a", highlight: "#ff6b6b" },
  { name: "Forest Sage", bg: "#0b1a0e", surface: "#132318", accent: "#52b788", cta: "#2d6a4f", text: "#d8f3dc", muted: "#74b89a", highlight: "#95d5b2" },
  { name: "Golden Hour", bg: "#1a1200", surface: "#2a1e00", accent: "#ffd60a", cta: "#e09d00", text: "#fff8e1", muted: "#c49b2e", highlight: "#ffec61" },
  { name: "Violet Dreams", bg: "#0d0a1a", surface: "#150e2a", accent: "#bf5af2", cta: "#9b3de0", text: "#f0e6ff", muted: "#9e79c2", highlight: "#d48fff" },
  { name: "Slate Clean", bg: "#f8fafc", surface: "#ffffff", accent: "#334155", cta: "#0f172a", text: "#0f172a", muted: "#64748b", highlight: "#3b82f6" },
  { name: "Rose Quartz", bg: "#fff0f3", surface: "#ffffff", accent: "#e63480", cta: "#c2185b", text: "#1a0010", muted: "#9e617a", highlight: "#ff4da6" },
  { name: "Obsidian Gold", bg: "#0c0b08", surface: "#18160f", accent: "#c9a84c", cta: "#a07820", text: "#f5eed8", muted: "#998555", highlight: "#f0cc66" },
  { name: "Arctic Blue", bg: "#e8f4f8", surface: "#ffffff", accent: "#0077b6", cta: "#005f8e", text: "#03045e", muted: "#5da8c2", highlight: "#48cae4" },
  { name: "Neon Pulse", bg: "#060010", surface: "#0d0020", accent: "#7b2fff", cta: "#5b00ff", text: "#f0e6ff", muted: "#7a5fa0", highlight: "#00f5d4" },
  { name: "Terracotta", bg: "#1c0d00", surface: "#2e1500", accent: "#e07a5f", cta: "#c45f44", text: "#fdf0eb", muted: "#b07060", highlight: "#f4a261" },
  { name: "Mint Fresh", bg: "#f0faf8", surface: "#ffffff", accent: "#00897b", cta: "#00695c", text: "#0d2b27", muted: "#52a99b", highlight: "#26c6da" },
  { name: "Charcoal Ember", bg: "#111111", surface: "#1c1c1c", accent: "#ff6b35", cta: "#e85d04", text: "#f8f0ec", muted: "#a07060", highlight: "#ffbe0b" },
  { name: "Indigo Ink", bg: "#f5f3ff", surface: "#ffffff", accent: "#4f46e5", cta: "#3730a3", text: "#1e1b4b", muted: "#818cf8", highlight: "#a78bfa" },
  { name: "Copper Patina", bg: "#0a1614", surface: "#111f1d", accent: "#b5835a", cta: "#8b5e3c", text: "#f0ebe3", muted: "#7a8e8b", highlight: "#74c69d" },
  { name: "Bubblegum", bg: "#fff0fb", surface: "#fff8fe", accent: "#d63af9", cta: "#b900d6", text: "#1a0020", muted: "#a070b0", highlight: "#ff70e0" },
  { name: "Steel Sunrise", bg: "#0d1117", surface: "#161b22", accent: "#58a6ff", cta: "#1f6feb", text: "#e6edf3", muted: "#8b949e", highlight: "#79c0ff" },
  { name: "Matcha", bg: "#f4f7f0", surface: "#ffffff", accent: "#4a7c59", cta: "#2e5e3e", text: "#1a2e1a", muted: "#7a9e7e", highlight: "#a8d5a2" },
  { name: "Blood Moon", bg: "#0e0505", surface: "#1a0a0a", accent: "#ff4136", cta: "#cc1100", text: "#fff5f5", muted: "#a05050", highlight: "#ff8070" },
  { name: "Champagne", bg: "#1a1510", surface: "#28211a", accent: "#d4b483", cta: "#b08040", text: "#f7efe0", muted: "#a08060", highlight: "#efd5a0" },
  { name: "Electric Lime", bg: "#050f00", surface: "#0a1c00", accent: "#a3e635", cta: "#65a30d", text: "#f0fde0", muted: "#6a9a30", highlight: "#d9f99d" },
  { name: "Dusk Purple", bg: "#f5f0ff", surface: "#ffffff", accent: "#7c3aed", cta: "#5b21b6", text: "#1e0050", muted: "#9070c0", highlight: "#c084fc" },
  { name: "Midnight Teal", bg: "#020e0e", surface: "#041818", accent: "#14b8a6", cta: "#0d9488", text: "#f0fdfa", muted: "#5a9090", highlight: "#5eead4" },
  { name: "Coral Reef", bg: "#fff8f5", surface: "#ffffff", accent: "#ff6b6b", cta: "#e63e3e", text: "#1a0800", muted: "#b07060", highlight: "#ffa94d" },
];

// ── 3. TYPOGRAPHY PAIRINGS  ───────────────────────────────────────────────
const FONT_PAIRINGS = [
  { heading: "Playfair Display", body: "Lato", import: "Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700" },
  { heading: "Space Grotesk", body: "DM Sans", import: "Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@300;400;500" },
  { heading: "Cormorant Garamond", body: "Jost", import: "Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500" },
  { heading: "Syne", body: "Nunito", import: "Syne:wght@400;700;800&family=Nunito:wght@300;400;600" },
  { heading: "Bebas Neue", body: "Open Sans", import: "Bebas+Neue&family=Open+Sans:wght@300;400;600" },
  { heading: "Fraunces", body: "Mulish", import: "Fraunces:wght@400;700;900&family=Mulish:wght@300;400;600" },
  { heading: "Outfit", body: "Source Sans 3", import: "Outfit:wght@400;600;700&family=Source+Sans+3:wght@300;400;600" },
  { heading: "Josefin Sans", body: "Karla", import: "Josefin+Sans:wght@300;400;700&family=Karla:wght@300;400;500" },
  { heading: "Raleway", body: "Hind", import: "Raleway:wght@400;600;800&family=Hind:wght@300;400;600" },
  { heading: "Libre Baskerville", body: "Nunito Sans", import: "Libre+Baskerville:wght@400;700&family=Nunito+Sans:wght@300;400;600" },
  { heading: "Clash Display", body: "Plus Jakarta Sans", import: "Plus+Jakarta+Sans:wght@300;400;600;700" },
  { heading: "Unbounded", body: "Figtree", import: "Unbounded:wght@400;700&family=Figtree:wght@300;400;500" },
  { heading: "DM Serif Display", body: "Work Sans", import: "DM+Serif+Display&family=Work+Sans:wght@300;400;500" },
  { heading: "Exo 2", body: "Questrial", import: "Exo+2:wght@400;600;800&family=Questrial" },
  { heading: "Gloock", body: "Switzer", import: "Gloock&family=Outfit:wght@300;400;500" },
  { heading: "Dela Gothic One", body: "Noto Sans", import: "Dela+Gothic+One&family=Noto+Sans:wght@300;400;500" },
  { heading: "Italiana", body: "Montserrat", import: "Italiana&family=Montserrat:wght@300;400;500" },
  { heading: "Big Shoulders Display", body: "Barlow", import: "Big+Shoulders+Display:wght@400;700;900&family=Barlow:wght@300;400;500" },
  { heading: "Abril Fatface", body: "Poppins", import: "Abril+Fatface&family=Poppins:wght@300;400;500" },
  { heading: "Cinzel", body: "Raleway", import: "Cinzel:wght@400;700&family=Raleway:wght@300;400;500" },
];

// ── FALLBACK FONTS (in case index is out of bounds) ───────────────────────
const FALLBACK_FONTS = {
  heading: "Inter",
  body: "Inter",
  import: "Inter:wght@300;400;600;700;900"
};

// ── 4. LAYOUT VARIANTS  ───────────────────────────────────────────────────
const HERO_LAYOUTS = [
  "centered-fullscreen", "split-left", "split-right",
  "diagonal-cut", "stacked-editorial", "floating-card",
];

const NAV_STYLES = [
  "glassmorphic", "solid-colored", "transparent-to-solid",
  "underline-indicator", "pill-indicator", "sidebar",
];

const CARD_STYLES = [
  "glassmorphic", "neumorphic", "border-glow",
  "flat-elevated", "outlined", "tinted-gradient",
];

// ── 5. INTERACTIVE ELEMENT SNIPPETS  ──────────────────────────────────────
const INTERACTIONS = {
  cursorGlow: `// Custom cursor glow
const cursor = document.createElement('div');
cursor.id = 'cursor-glow';
cursor.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:0;transition:transform 0.15s ease;background:radial-gradient(circle,var(--cursor-color,rgba(255,255,255,0.06)),transparent 70%)';
document.body.appendChild(cursor);
document.addEventListener('mousemove', e => {
  cursor.style.left = (e.clientX - 150) + 'px';
  cursor.style.top  = (e.clientY - 150) + 'px';
});`,

  scrollReveal: `// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));`,

  activeNavHighlight: `// Active nav section highlight
const navLinks = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });`,

  navScrollBehavior: `// Navbar scroll behavior
const navbar = document.querySelector('nav, header');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });`,

  counterAnimation: `// Count-up animation for stats
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1800;
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(p * target).toLocaleString() + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(update);
  };
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { requestAnimationFrame(update); io.disconnect(); }
  });
  io.observe(el);
});`,

  tabSwitcher: `// Tab switcher for services/features
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('[data-panel="' + target + '"]')?.classList.add('active');
  });
});`,

  mobileMenu: `// Mobile hamburger menu
const menuBtn = document.querySelector('.menu-btn, .hamburger, #menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu, .nav-links, #mobile-nav');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu?.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuBtn.classList.toggle('active', open);
});
document.querySelectorAll('.nav-link').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    menuBtn?.classList.remove('active');
  })
);`,

  parallaxHero: `// Subtle parallax on hero
const heroVisual = document.querySelector('.hero-bg, .hero-visual, .parallax-el');
window.addEventListener('scroll', () => {
  if (heroVisual) heroVisual.style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
}, { passive: true });`,

  glowHover: `// Glow effect on cards
document.querySelectorAll('.card, .service-card, .feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});`,
};

// ── 6. SECTION TEMPLATES  ─────────────────────────────────────────────────
function getSectionGuidance(section, industry, palette, fonts) {
  const guides = {
    header: `
NAVBAR — use "${fonts?.navStyle || 'glassmorphic'}" style:
- Logo: stylized text or inline SVG icon, using --accent color
- Links: smooth scroll to sections; active link visually distinct
- MUST include class="nav-link" on every anchor for JS to highlight active`,

    hero: `
HERO — "${fonts?.heroLayout || 'centered-fullscreen'}" layout:
- Headline: clamp(3.5rem, 7vw, 6.5rem), font-weight 800–900
- Primary CTA button + Ghost secondary button
- Add data-reveal="fade-up" to headline, subtitle, and buttons`,

    services: `
SERVICES/FEATURES — use "${fonts?.cardStyle || 'glassmorphic'}" card style:
- 3–6 cards: icon (inline SVG) + title + 2-line description
- Add data-reveal="fade-up" with staggered delays`,

    about: `
ABOUT:
- Split layout: left = text/story, right = image + stats
- 3–4 stat counters using data-count="NUMBER" data-suffix="+"`,

    testimonials: `
TESTIMONIALS:
- 2–3 testimonial cards with: quote, author name, role, avatar`,

    contact: `
CONTACT:
- Two columns: left = contact info, right = form
- Form fields: Name, Email, Subject, Message`,

    footer: `
FOOTER:
- 4 columns: Brand | Quick Links | Services | Contact + Social icons
- Bottom bar: copyright with dynamic year`,
  };
  return guides[section] || `- Full, meaningful content for a ${industry} business`;
}

// ── 7. MAIN EXPORT  ───────────────────────────────────────────────────────
export function buildPrompt(userPrompt, intent) {
  const sections = intent.sections || ['header', 'hero', 'about', 'services', 'contact', 'footer'];
  const industry = intent.industry || 'business';

  // Deterministic variety from prompt seed
  const seed = hashString(userPrompt + industry);

  // SAFE palette selection
  const palette = (intent.colors && intent.colors.length >= 3)
    ? { name: "Custom", bg: intent.colors[0], surface: intent.colors[1], accent: intent.colors[2], cta: intent.colors[2], text: "#ffffff", muted: "#aaaaaa", highlight: intent.colors[2] }
    : PALETTES[seed % PALETTES.length] || PALETTES[0];

  // SAFE font assignment with fallback
  const fontIndex = (seed >> 3) % FONT_PAIRINGS.length;
  const fonts = FONT_PAIRINGS[fontIndex] || FALLBACK_FONTS;

  const heroLayout = HERO_LAYOUTS[(seed >> 5) % HERO_LAYOUTS.length] || "centered-fullscreen";
  const navStyle = NAV_STYLES[(seed >> 7) % NAV_STYLES.length] || "glassmorphic";
  const cardStyle = CARD_STYLES[(seed >> 9) % CARD_STYLES.length] || "glassmorphic";

  // Attach derived extras to fonts object (SAFE - fonts is guaranteed to exist)
  fonts.heroLayout = heroLayout;
  fonts.navStyle = navStyle;
  fonts.cardStyle = cardStyle;

  // Pick interactions bundle
  const isDark = ['#0', '#1', '#0a', '#0b', '#0c', '#0d', '#0e', '#06'].some(p => palette.bg.startsWith(p));
  const interactionSnippets = [
    INTERACTIONS.mobileMenu,
    INTERACTIONS.scrollReveal,
    INTERACTIONS.activeNavHighlight,
    INTERACTIONS.navScrollBehavior,
    INTERACTIONS.counterAnimation,
    INTERACTIONS.glowHover,
    isDark ? INTERACTIONS.cursorGlow : INTERACTIONS.parallaxHero,
    INTERACTIONS.tabSwitcher,
  ].join('\n\n');

  // Build section guidance
  const sectionGuidance = sections
    .map(s => `\n### ${s.toUpperCase()}\n${getSectionGuidance(s, industry, palette, fonts)}`)
    .join('\n');

  const sectionIds = sections.map(s => `#${s}`).join(', ');

  // ── FINAL PROMPT ─────────────────────────────────────────────────────────
  return `You are a world-class UI/UX designer and Frontend Developer. Build a STUNNING, PIXEL-PERFECT, FULLY INTERACTIVE, and ULTRA-RESPONSIVE single-page website.
The design MUST feel premium, modern, and visually breathtaking. Use advanced CSS techniques like glassmorphism, dynamic gradients, smooth micro-animations, and responsive Flexbox/Grid layouts. It must look perfect on mobile, tablet, and desktop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 USER REQUEST : "${userPrompt}"
🏭 INDUSTRY     : ${industry}
🎨 PALETTE      : ${palette.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 BASE CSS VARIABLES & FONTS
:root {
  --bg: \${palette.bg};
  --surface: \${palette.surface};
  --accent: \${palette.accent};
  --cta: \${palette.cta};
  --text: \${palette.text};
  --muted: \${palette.muted};
  --highlight: \${palette.highlight};
  --font-heading: '\${fonts.heading}', sans-serif;
  --font-body: '\${fonts.body}', sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=\${fonts.import}&display=swap');

🏗️ SECTION GUIDANCE
Follow these section guidelines closely to structure the page:
\${sectionGuidance}
The sections should be: \${sectionIds}

✨ INTERACTIVITY & JAVASCRIPT
You MUST include a <script> tag at the end of the <body> with the following Javascript to make the page highly interactive. Ensure all HTML elements referenced in this code exist with the correct classes/IDs!
<script>
\${interactionSnippets}
</script>

═══════════════════════════════════════════════════
🚫 ABSOLUTE RULES
═══════════════════════════════════════════════════
1. ❌ NO href="page.html" — ONLY href="#section-id" for navigation.
2. ✅ ALL HTML, CSS (in <style>), and JS (in <script>) MUST be contained in ONE single HTML file.
3. ✅ HTML starts with <!DOCTYPE html>, ends with </html>.
4. ❌ NO Lorem Ipsum — generate real, high-quality content tailored to the request.
5. ✅ Ensure deep responsiveness: Use media queries to adapt font sizes, padding, and flex/grid directions.
6. ✅ EVERY card must have class="card" (or "feature-card", "service-card") for hover effects to work.
7. ✅ Focus heavily on visual excellence: drop-shadows, transitions, hover states, and beautiful spacing.

Return ONLY the raw HTML code. Do not wrap it in markdown formatting blocks. GO.`;
}