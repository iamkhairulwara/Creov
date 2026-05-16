export function validateOutput(html) {
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