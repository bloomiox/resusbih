// Meta tags testing utility
export const debugMetaTags = () => {
  console.log('=== Current Meta Tags ===');
  
  const metaTags = [
    'og:title',
    'og:description', 
    'og:image',
    'og:url',
    'og:type',
    'og:site_name',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'description'
  ];

  metaTags.forEach(tag => {
    const element = document.querySelector(`meta[property="${tag}"]`) || 
                   document.querySelector(`meta[name="${tag}"]`);
    if (element) {
      console.log(`${tag}:`, element.getAttribute('content'));
    } else {
      console.log(`${tag}: NOT FOUND`);
    }
  });

  console.log('Page title:', document.title);
  console.log('Current URL:', window.location.href);
};

// Make available in development
if (import.meta.env.VITE_NODE_ENV === 'development') {
  (window as any).debugMetaTags = debugMetaTags;
}