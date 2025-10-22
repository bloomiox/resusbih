// Cloudflare Pages Function for dynamic meta tags
// This will handle requests to /news?article=X and return HTML with proper meta tags

interface Env {
  // Add any environment variables you need
}

// Mock news data - in production, this would come from your database
const mockNewsData = [
  {
    id: 9,
    title: "Važna obavijest o novom kursu",
    shortDescription: "Obavještavamo vas o pokretanju novog kursa osnovne životne podrške koji će se održati sljedećeg mjeseca.",
    imageUrl: "https://res.cloudinary.com/dev6d0spf/image/upload/v1/news/main/sample-image.jpg"
  },
  // Add more mock articles as needed
];

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const articleId = url.searchParams.get('article');

  // If no article ID, serve the regular app
  if (!articleId) {
    return context.next();
  }

  // Find the article
  const article = mockNewsData.find(a => a.id === parseInt(articleId));
  
  // If article not found, serve the regular app
  if (!article) {
    return context.next();
  }

  // Generate HTML with proper meta tags
  const html = `<!DOCTYPE html>
<html lang="hr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${article.title} | RESUSBIH</title>
    
    <!-- Article-specific Meta Tags -->
    <meta name="description" content="${article.shortDescription}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${article.title} | RESUSBIH" />
    <meta property="og:description" content="${article.shortDescription}" />
    <meta property="og:image" content="${article.imageUrl || 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png'}" />
    <meta property="og:url" content="${url.toString()}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="RESUSBIH" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.title} | RESUSBIH" />
    <meta name="twitter:description" content="${article.shortDescription}" />
    <meta name="twitter:image" content="${article.imageUrl || 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png'}" />
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'brand-blue': '#133d7d',
              'brand-lightblue': '#3E92CC',
              'brand-red': '#D8315B',
              'brand-white': '#FFFFFF',
              'brand-gray': '#F8F9FA'
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/",
    "react/": "https://aistudiocdn.com/react@^19.1.1/",
    "react": "https://aistudiocdn.com/react@^19.1.1"
  }
}
</script>
  </head>
  <body class="bg-brand-gray">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}