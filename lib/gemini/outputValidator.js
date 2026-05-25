export function validateOutput(html) {
  if (!html) {
    console.warn("⚠️ validateOutput received null or undefined HTML. Returning fallback page.");
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Generation Failed</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #475569; }
        .card { text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 400px; }
        h1 { color: #0f172a; margin-top: 0; }
    </style>
</head>
<body>
    <div class="card">
        <h1>⚠️ Generation Failed</h1>
        <p>The AI could not generate the website. Please check your API key and try again.</p>
    </div>
</body>
</html>`;
  }
  let cleanHtml = html;
  
  // FORCE SINGLE-PAGE: Remove any external links
  cleanHtml = cleanHtml.replace(/href="([^"#][^"]*)"/g, (match, link) => {
    // If link is not an anchor (#), replace it with #
    if (!link.startsWith('#')) {
      console.warn(`Removing external link: ${link}`);
      return 'href="#"';
    }
    return match;
  });
  
  // Remove any form actions that point to other pages
  cleanHtml = cleanHtml.replace(/action="([^"]+)"/g, (match, action) => {
    if (action !== '#' && !action.startsWith('#')) {
      return 'action="#"';
    }
    return match;
  });
  
  // Ensure smooth scrolling exists
  if (!cleanHtml.includes('scroll-behavior: smooth')) {
    cleanHtml = cleanHtml.replace('<style>', '<style>html{scroll-behavior:smooth;}');
  }
  
  // Add ID to body to prevent page reloads
  cleanHtml = cleanHtml.replace('<body>', '<body data-single-page="true">');
  
  // Add JavaScript to prevent any accidental navigation
  const preventNavigation = `
  <script>
    // Prevent any external navigation
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        console.warn('External link blocked:', link.getAttribute('href'));
        return false;
      }
    });
  </script>
  `;
  
  // Insert before closing body
  cleanHtml = cleanHtml.replace('</body>', preventNavigation + '</body>');
  
  return cleanHtml;
}