export function showToast(message, isError = false) {
  // Remove existing toasts
  const existing = document.getElementById('creov-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'creov-toast';
  
  // Use HTML in case we want to pass icons (like SVG strings)
  toast.innerHTML = message;
  
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: ${isError ? '#ef4444' : '#06b6d4'};
    color: white; padding: 12px 20px;
    border-radius: 10px; font-size: 13px;
    z-index: 99999; font-family: Inter, sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-weight: 500;
    display: flex; align-items: center; gap: 8px;
    animation: toastFadeIn 0.2s ease-out forwards;
    transition: all 0.2s ease-out;
  `;
  
  if (!document.getElementById('creov-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'creov-toast-styles';
    style.innerHTML = `
      @keyframes toastFadeIn { 
        0% { opacity: 0; transform: translateY(10px); } 
        100% { opacity: 1; transform: translateY(0); } 
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}
