export function buildPrompt(userPrompt, intent) {
  const sections = intent.sections || ['header', 'hero', 'content', 'footer'];
  
  const prompt = `CRITICAL: Create ONE SINGLE HTML FILE ONLY. NO MULTIPLE PAGES.

ABSOLUTE RULES (VIOLATION = FAILURE):
1. ❌ NO href="another-page.html" 
2. ❌ NO href="/contact" or any path with slashes
3. ❌ NO window.location or page navigation
4. ❌ NO multiple HTML files
5. ✅ ONLY href="#section-id" for navigation
6. ✅ ALL content in ONE HTML document
7. ✅ Use <section id="home">, <section id="about">, etc.
8. ✅ Use html { scroll-behavior: smooth; }

USER REQUEST: "${userPrompt}"

REQUIRED SECTIONS: ${sections.map(s => `section id="${s}"`).join(', ')}

STRUCTURE:
<nav>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <!-- ALL links start with # ONLY -->
</nav>

<section id="home">Content for home</section>
<section id="about">Content for about</section>
<!-- ALL content in sections with IDs -->

STYLE:
- Fixed navigation bar
- Each section takes full viewport height (min-height: 100vh)
- Smooth scrolling between sections
- Responsive design

Generate COMPLETE HTML/CSS. ONE FILE. NO EXTERNAL PAGES.`;
  
  return prompt;
}