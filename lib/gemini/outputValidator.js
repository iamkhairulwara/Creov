export function validateOutput(html) {
  if (!html) {
    console.warn("⚠️ validateOutput received null or undefined HTML. Returning fallback page.");
    return getFallbackTemplate();
  }
  
  let cleanHtml = html;
  
  // Remove markdown code blocks if present
  cleanHtml = cleanHtml.replace(/```html\s*/gi, '');
  cleanHtml = cleanHtml.replace(/```\s*/g, '');
  
  // ============================================================
  // FIX: Move any @import rules into <style> tags
  // ============================================================
  
  // Find @import statements that are outside style tags
  const importRegex = /@import\s+url\([^)]+\);/gi;
  const imports = cleanHtml.match(importRegex) || [];
  
  if (imports.length > 0) {
    // Remove standalone @import lines
    cleanHtml = cleanHtml.replace(importRegex, '');
    
    // Create style block with imports
    const styleBlock = `<style>\n${imports.join('\n')}\n</style>`;
    
    // Insert into head
    if (cleanHtml.includes('<head>')) {
      cleanHtml = cleanHtml.replace('<head>', `<head>\n${styleBlock}`);
    } else if (cleanHtml.includes('<!DOCTYPE html>')) {
      cleanHtml = cleanHtml.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n${styleBlock}`);
    }
  }
  
  // ============================================================
  // FIX: Ensure proper HTML structure
  // ============================================================
  
  // Check if HTML has proper structure
  if (!cleanHtml.includes('<!DOCTYPE html>')) {
    cleanHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Creov Website</title>\n</head>\n<body>\n${cleanHtml}\n</body>\n</html>`;
  }
  
  // Ensure style tags are properly placed
  if (cleanHtml.includes('@import') && !cleanHtml.includes('<style>')) {
    cleanHtml = cleanHtml.replace('@import', '<style>@import');
    cleanHtml = cleanHtml.replace('</head>', '</style></head>');
  }
  
  // ============================================================
  // ONLY BLOCK EXTERNAL PAGE LINKS (preserve resources)
  // ============================================================
  
  // Block only links that point to other HTML pages
  cleanHtml = cleanHtml.replace(/href="([^"#][^"]*\.html)"/gi, 'href="#"');
  cleanHtml = cleanHtml.replace(/href="\/(?!fonts\.|picsum\.|images\.|icons\.)[^"]*"/gi, 'href="#"');
  
  // Remove form actions that point to other pages
  cleanHtml = cleanHtml.replace(/action="([^"]+)"/g, (match, action) => {
    if (action && !action.startsWith('#') && !action.startsWith('mailto:') && !action.startsWith('javascript:')) {
      return 'action="#"';
    }
    return match;
  });
  
  // ============================================================
  // ENSURE SMOOTH SCROLLING
  // ============================================================
  
  if (!cleanHtml.includes('scroll-behavior: smooth')) {
    cleanHtml = cleanHtml.replace(/<style>/gi, '<style>html{scroll-behavior:smooth;}');
  }
  
  // ============================================================
  // ADD SINGLE-PAGE PROTECTION
  // ============================================================
  
  cleanHtml = cleanHtml.replace('<body>', '<body data-single-page="true">');
  
  const preventNavigation = `
  <script>
    (function() {
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.getAttribute('href')) return;
        
        const href = link.getAttribute('href');
        
        const isValid = (
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('javascript:') ||
          href.includes('picsum.photos') ||
          href.includes('fonts.googleapis.com') ||
          href.match(/\\.(jpg|jpeg|png|gif|svg|webp)$/i)
        );
        
        if (!isValid && (href.endsWith('.html') || href.match(/^\\/[^?#]+\\.html?/))) {
          e.preventDefault();
          console.warn('External page link blocked:', href);
          return false;
        }
        
        if (!isValid && href.startsWith('http')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    })();
  </script>
  `;
  
  cleanHtml = cleanHtml.replace('</body>', preventNavigation + '</body>');
  
  return cleanHtml;
}

function getFallbackTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creov - Website Generator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        .hero {
            text-align: center;
            padding: 80px 20px;
        }
        h1 {
            font-size: clamp(2.5rem, 8vw, 5rem);
            margin-bottom: 20px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 60px;
        }
        .card {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            transition: transform 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .card:hover { transform: translateY(-8px); }
        button {
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 30px;
            font-weight: 600;
        }
        @media (max-width: 768px) {
            .container { padding: 30px 16px; }
            .hero { padding: 40px 16px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>✨ Creov AI Generator</h1>
            <p style="font-size: 1.2rem; opacity: 0.9;">Your website is being generated</p>
            <button onclick="location.reload()">Try Again</button>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3 style="color: #06b6d4;">🚀 AI-Powered</h3>
                <p>Advanced AI generates stunning websites from your prompt</p>
            </div>
            <div class="card">
                <h3 style="color: #06b6d4;">🎨 Fully Editable</h3>
                <p>Drag-and-drop editor for complete customization</p>
            </div>
            <div class="card">
                <h3 style="color: #06b6d4;">⚡ One-Click Publish</h3>
                <p>Deploy your website instantly with our publishing feature</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}