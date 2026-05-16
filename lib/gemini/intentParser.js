// export function parseIntent(prompt) {
//   const lower = prompt.toLowerCase()

//   const industries = ['restaurant', 'portfolio', 'business',
//     'landing', 'blog', 'shop', 'agency', 'medical', 'education']
//   const industry = industries.find(i => lower.includes(i)) || 'business'

//   const styles = ['modern', 'minimal', 'bold', 'elegant',
//     'playful', 'professional', 'creative']
//   const style = styles.find(s => lower.includes(s)) || 'modern'

//   const colorMoods = ['dark', 'light', 'colorful', 'monochrome']
//   const colorMood = colorMoods.find(c => lower.includes(c)) || 'light'

//   const sectionMap = {
//     'about': 'about section',
//     'contact': 'contact form',
//     'portfolio': 'portfolio grid',
//     'pricing': 'pricing table',
//     'testimonial': 'testimonials section',
//     'menu': 'menu section',
//     'service': 'services section',
//     'team': 'team section',
//     'faq': 'FAQ section',
//     'gallery': 'image gallery'
//   }

//   const detectedSections = Object.keys(sectionMap)
//     .filter(k => lower.includes(k))
//     .map(k => sectionMap[k])

//   const sections = [
//     'navigation bar',
//     'hero section',
//     'footer',
//     ...detectedSections
//   ]

//   return {
//     industry,
//     style,
//     colorMood,
//     sections,
//     rawPrompt: prompt
//   }
// }
export function parseIntent(prompt) {
  try {
    // Default values (always provide fallbacks)
    const defaultIntent = {
      industry: 'general',
      style: 'modern',
      sections: ['header', 'hero', 'content', 'footer'],
      colors: ['#ffffff', '#333333'],
      pages: 1,
      features: []
    };
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract industry with safe defaults
    let industry = 'general';
    if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('photographer') || lowerPrompt.includes('artist')) {
      industry = 'portfolio';
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('cafe') || lowerPrompt.includes('food')) {
      industry = 'restaurant';
    } else if (lowerPrompt.includes('business') || lowerPrompt.includes('corporate') || lowerPrompt.includes('company')) {
      industry = 'business';
    } else if (lowerPrompt.includes('landing') || lowerPrompt.includes('product') || lowerPrompt.includes('saas')) {
      industry = 'landing';
    } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('magazine')) {
      industry = 'blog';
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) {
      industry = 'ecommerce';
    }
    
    // Extract style with safe defaults
    let style = 'modern';
    if (lowerPrompt.includes('minimal') || lowerPrompt.includes('simple')) {
      style = 'minimal';
    } else if (lowerPrompt.includes('bold') || lowerPrompt.includes('colorful')) {
      style = 'bold';
    } else if (lowerPrompt.includes('elegant') || lowerPrompt.includes('luxury')) {
      style = 'elegant';
    } else if (lowerPrompt.includes('dark')) {
      style = 'dark';
    } else if (lowerPrompt.includes('light')) {
      style = 'light';
    }
    
    // Extract sections (ALWAYS return an array, never undefined)
    let sections = ['header', 'hero', 'content', 'footer']; // default
    
    if (industry === 'portfolio') {
      sections = ['header', 'hero', 'gallery', 'about', 'contact', 'footer'];
    } else if (industry === 'restaurant') {
      sections = ['header', 'hero', 'menu', 'about', 'reservation', 'contact', 'footer'];
    } else if (industry === 'business') {
      sections = ['header', 'hero', 'services', 'about', 'team', 'contact', 'footer'];
    } else if (industry === 'landing') {
      sections = ['header', 'hero', 'features', 'pricing', 'cta', 'footer'];
    }
    
    // Custom sections from prompt
    if (lowerPrompt.includes('testimonial')) {
      sections.push('testimonials');
    }
    if (lowerPrompt.includes('pricing')) {
      sections.push('pricing');
    }
    if (lowerPrompt.includes('faq')) {
      sections.push('faq');
    }
    
    // Remove duplicates while preserving order
    sections = [...new Set(sections)];
    
    // Extract colors with defaults
    let colors = ['#ffffff', '#333333'];
    if (style === 'dark') {
      colors = ['#1a1a1a', '#ffffff'];
    } else if (style === 'bold') {
      colors = ['#ff6b6b', '#4ecdc4'];
    } else if (style === 'elegant') {
      colors = ['#f8f9fa', '#2c3e50'];
    }
    
    return {
      industry,
      style,
      sections: sections || ['header', 'footer'], // Ultimate fallback
      colors,
      pages: 1,
      features: []
    };
    
  } catch (error) {
    console.error('Intent parser error:', error);
    // Return safe default if anything goes wrong
    return {
      industry: 'general',
      style: 'modern',
      sections: ['header', 'hero', 'content', 'footer'],
      colors: ['#ffffff', '#333333'],
      pages: 1,
      features: []
    };
  }
}