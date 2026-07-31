'use client';
import { templateRegistry } from '@/components/templates/registry';
import { useState } from 'react';

// A mock function that replaces {{placeholders}} with real data
const injectPlaceholders = (Component, sectionKey) => {
  const dummyData = {
    heroHeadline: 'Build Faster. Scale Better.',
    heroSubheadline: 'The ultimate tool for creators, designed to give you back your time and unleash your creativity.',
    heroCta1: 'Get Started Free',
    heroCta2: 'Book a Demo',
    heroBadgeText: 'NEW RELEASE v2.0',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    heroImageAlt: 'Laptop with code',

    aboutImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    aboutImageAlt: 'Team working',
    aboutBadgeNumber: '10+',
    aboutBadgeText: 'Years Exp',
    aboutTitle: 'Empowering the Next Generation of Builders',
    aboutDescription: 'We believe that technology should enable, not hinder. Our platform provides everything you need to succeed.',
    aboutDescription1: 'We started with a simple idea: make professional web development accessible to everyone without sacrificing quality or performance.',
    aboutDescription2: 'Today, thousands of companies trust us to power their digital presence.',
    aboutPoint1: 'Enterprise-grade security built-in',
    aboutPoint2: 'Lightning fast global CDN',
    aboutPoint3: '24/7 priority customer support',
    aboutCta: 'Learn More About Us',
    
    stat1Value: '100k+', stat1Label: 'Active Users',
    stat2Value: '99.9%', stat2Label: 'Uptime',
    stat3Value: '50M', stat3Label: 'API Calls',
    stat4Value: '24/7', stat4Label: 'Support',

    step1Year: '2020', step1Title: 'The Beginning', step1Description: 'We launched our first beta to a small group of early adopters.',
    step2Year: '2021', step2Title: 'Series A', step2Description: 'Raised $10M to scale our engineering and product teams.',
    step3Year: '2022', step3Title: 'Global Expansion', step3Description: 'Opened offices in London, Tokyo, and Sydney.',
    step4Year: '2024', step4Title: 'The Future', step4Description: 'Releasing v3.0 with full AI integration and automation.',

    featuresTitle: 'Everything You Need to Succeed',
    featuresDescription: 'Powerful features wrapped in an intuitive interface.',
    
    feature1Badge: 'PERFORMANCE', feature1Title: 'Lightning Fast Delivery', feature1Desc: 'Our edge network ensures your content reaches users instantly.', feature1Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', feature1ImageAlt: 'Speed',
    feature2Badge: 'SECURITY', feature2Title: 'Bank-grade Encryption', feature2Desc: 'Your data is secured with AES-256 and SOC2 compliance.', feature2Image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop', feature2ImageAlt: 'Security',
    feature3Badge: 'SCALE', feature3Title: 'Infinite Scalability', feature3Desc: 'Grow without worrying about infrastructure limits.',

    tab1Title: 'Design', tab1Subtitle: 'Pixel perfect control', tab1ContentTitle: 'Visual Editing Reimagined', tab1ContentDesc: 'Drag, drop, and tweak every pixel without writing a single line of CSS. Your vision, realized instantly.', tab1Image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop',
    tab2Title: 'Develop', tab2Subtitle: 'Code when you need it', tab2ContentTitle: 'Full Code Access', tab2ContentDesc: 'Drop down into the code anytime. We use standard React and Tailwind, so there is no lock-in.', tab2Image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    tab3Title: 'Deploy', tab3Subtitle: 'Ship in seconds', tab3ContentTitle: 'One-Click Global Deploy', tab3ContentDesc: 'Push to production across our edge network in under 3 seconds. Instant rollbacks included.', tab3Image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',

    testimonialsTitle: 'Loved by Thousands',
    testimonialsSubtitle: 'Don\'t just take our word for it. See what our users have to say.',
    
    testimonial1Quote: 'This platform completely transformed how our agency delivers websites. We are 3x faster now.', testimonial1Avatar: 'https://i.pravatar.cc/150?u=1', testimonial1Name: 'Sarah Jenkins', testimonial1Role: 'Creative Director',
    testimonial2Quote: 'The performance out of the box is incredible. We scored 100 on Lighthouse without trying.', testimonial2Avatar: 'https://i.pravatar.cc/150?u=2', testimonial2Name: 'David Chen', testimonial2Role: 'Lead Engineer',
    testimonial3Quote: 'Finally, a tool that designers and developers can both agree on.', testimonial3Avatar: 'https://i.pravatar.cc/150?u=3', testimonial3Name: 'Elena Rodriguez', testimonial3Role: 'Product Manager',

    singleQuote: 'Creov is the single best investment our company made this year. It paid for itself in week one.', singleAvatar: 'https://i.pravatar.cc/150?u=4', singleName: 'Michael Chang', singleRole: 'CEO', singleCompany: 'TechFlow',

    gridQuote1: 'Incredible DX.', gridAvatar1: 'https://i.pravatar.cc/150?u=5', gridName1: 'Alex', gridRole1: 'Dev',
    gridQuote2: 'So fast!', gridAvatar2: 'https://i.pravatar.cc/150?u=6', gridName2: 'Sam', gridRole2: 'Designer',
    gridQuote3: 'Beautiful templates.', gridAvatar3: 'https://i.pravatar.cc/150?u=7', gridName3: 'Jordan', gridRole3: 'Marketing',

    contactTitle: 'Ready to get started?',
    contactDesc: 'Join thousands of creators building the future of the web.',
    contactAddress: '123 Innovation Drive, Tech City, TC 94103',
    contactEmail: 'hello@creov.app',
    contactPhone: '+1 (555) 123-4567',
    contactMapOverlay: 'Interactive Map Here',
    contactMapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop',
    ctaButtonText: 'Send Message',
    contactDisclaimer: 'No credit card required. Cancel anytime.'
  };

  // We wrap the component to inject dummy data into the JSX string rendering logic
  // In a real app, the AI outputs a raw HTML string. Here we are previewing the React components directly.
  // To simulate replacing {{placeholder}}, we'd normally parse HTML. For these React components, 
  // they are expecting the text literals '{{placeholder}}' in their source. 
  // Wait, React components render exactly what's written. We can't string-replace a React component's source at runtime easily!
  //
  // For the sake of this preview, since we wrote the components with hardcoded {{placeholders}} in JSX, 
  // React will literally render "{{heroHeadline}}". 
  // To make the preview useful, we need a trick: we will render the component to a string, replace it, and dangerouslySetInnerHTML.
  import('react-dom/server').then(ReactDOMServer => {
    // This is a client side workaround just for the preview tool.
  });
  
  return function InjectedWrapper() {
    const [html, setHtml] = useState(null);
    
    // We render the component inside a hidden div, then grab its innerHTML, replace placeholders, and re-render.
    // However, this breaks React state (like tabs and carousels). 
    // To keep interactivity for the preview, we will just let it render the {{placeholders}} as literal text.
    // The user will see "{{heroHeadline}}" on the screen, which proves the layout works!
    
    // Actually, to make it look "real", we can use a MutationObserver or just accept that the text will be placeholders.
    // The instructions said: "render every single template variant on one page with sample placeholder content filled in"
    // Since they are React components, the only way to "fill them in" without props is to manipulate the DOM after render.

    return (
      <div className="relative group" id={`preview-${sectionKey}`}>
        <Component />
        
        {/* Helper script to replace text nodes in the DOM for this component instance */}
        <ScriptPlaceholderInjector data={dummyData} targetId={`preview-${sectionKey}`} />
      </div>
    );
  }
}

// A helper component to replace placeholders in the DOM after the component mounts
function ScriptPlaceholderInjector({ data, targetId }) {
  useEffect(() => {
    const replaceTextNodes = (node) => {
      if (node.nodeType === 3) { // Text node
        let text = node.nodeValue;
        let modified = false;
        Object.keys(data).forEach(key => {
          const placeholder = `{{${key}}}`;
          if (text.includes(placeholder)) {
            text = text.replace(new RegExp(placeholder, 'g'), data[key]);
            modified = true;
          }
        });
        if (modified) node.nodeValue = text;
      } else if (node.nodeType === 1) { // Element node
        // Also check attributes like src, alt
        Array.from(node.attributes).forEach(attr => {
          let text = attr.value;
          let modified = false;
          Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            if (text.includes(placeholder)) {
              text = text.replace(new RegExp(placeholder, 'g'), data[key]);
              modified = true;
            }
          });
          if (modified) attr.value = text;
        });
        
        node.childNodes.forEach(replaceTextNodes);
      }
    };

    const target = document.getElementById(targetId);
    if (target) {
      // Small timeout to ensure child components have mounted
      setTimeout(() => {
        replaceTextNodes(target);
      }, 100);
    }
  }, [data, targetId]);

  return null;
}

export default function TemplatePreviewPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30">
      
      {/* Header */}
      <div className="py-8 bg-[#0a0f1e] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-black neon-text-cyan-blue">Template Registry Preview</h1>
          <div className="text-sm font-medium text-slate-400">
            Total Templates: {Object.values(templateRegistry).flat().length}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-32">
        
        {/* Render each category */}
        {Object.entries(templateRegistry).map(([category, templates]) => (
          <div key={category} className="space-y-12">
            
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold uppercase tracking-widest text-slate-200">
                {category}
              </h2>
              <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1" />
            </div>

            <div className="space-y-32">
              {templates.map((template) => {
                const WrappedComponent = injectPlaceholders(template.component, template.id);
                return (
                  <div key={template.id} className="relative border border-white/10 rounded-[3rem] overflow-hidden bg-black shadow-2xl">
                    
                    {/* Component Metadata Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md">{template.name}</h3>
                        <p className="text-sm text-slate-300 shadow-black drop-shadow-md">{template.description}</p>
                      </div>
                      <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400 border border-white/10">
                        {template.id}
                      </div>
                    </div>

                    {/* The Actual Component */}
                    <WrappedComponent />
                    
                  </div>
                );
              })}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
