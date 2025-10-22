// Cloudflare Worker for dynamic article meta tags
// This worker intercepts requests and generates HTML with proper meta tags for social media crawlers

// Default configuration
const DEFAULT_CONFIG = {
  SITE_URL: 'https://resusbih.org',
  DEFAULT_IMAGE: 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png',
  SITE_NAME: 'RESUSBIH',
  DEFAULT_TITLE: 'Udruženje Resuscitacijski savjet u Bosni i Hercegovini',
  DEFAULT_DESCRIPTION: 'Znanje koje spašava živote. Promicanje i unaprjeđenje znanja i vještina oživljavanja u Bosni i Hercegovini.'
};

// Create Supabase client
function createSupabaseClient(env) {
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://hywmnhwrzebubmnimdow.supabase.co';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5d21uaHdyemVidWJtbmltZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTYyNzksImV4cCI6MjA3MzgzMjI3OX0.M9WQvNBzzMcaeWt0Ozr8iM66NCGgLhJAQX5r3hkv83c';
  
  return {
    url: supabaseUrl,
    key: supabaseKey,
    
    async fetchArticle(articleId) {
      const response = await fetch(`${supabaseUrl}/rest/v1/news_articles?id=eq.${articleId}&select=id,title,short_description,full_content,image_url,created_at`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    }
  };
}

// Check if request is from a social media crawler
function isSocialMediaBot(userAgent) {
  if (!userAgent) return false;
  
  const botPatterns = [
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'TelegramBot',
    'SkypeUriPreview',
    'SlackBot',
    'DiscordBot',
    'GoogleBot',
    'bingbot',
    'YandexBot'
  ];
  
  return botPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
}

// Generate article description with fallbacks
function generateDescription(article) {
  // Use short_description if available
  if (article.short_description && article.short_description.trim()) {
    return article.short_description.trim();
  }
  
  // Fallback to first 150 characters of full_content
  if (article.full_content && article.full_content.trim()) {
    let description = article.full_content.substring(0, 150).replace(/\n/g, ' ').trim();
    if (description.length === 150) {
      description += '...';
    }
    return description;
  }
  
  // Final fallback
  return 'Pročitajte najnovije vijesti iz Udruženja Resuscitacijski savjet u Bosni i Hercegovini.';
}

// Generate HTML with proper meta tags
function generateArticleHTML(article, config = DEFAULT_CONFIG) {
  const title = article.title || 'Novost';
  const description = generateDescription(article);
  const image = article.image_url || config.DEFAULT_IMAGE;
  const url = `${config.SITE_URL}/news?article=${article.id}`;
  const publishedTime = article.created_at || new Date().toISOString();
  
  // Escape HTML entities
  const escapeHtml = (str) => str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  
  return `<!DOCTYPE html>
<html lang="hr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="${config.DEFAULT_IMAGE}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapedTitle} | ${config.SITE_NAME}</title>
    
    <!-- Article Meta Tags -->
    <meta name="description" content="${escapedDescription}" />
    <meta name="author" content="${config.SITE_NAME}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${escapedTitle} | ${config.SITE_NAME}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${config.SITE_NAME}" />
    <meta property="og:locale" content="hr_HR" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle} | ${config.SITE_NAME}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@resusbih" />
    
    <!-- Article Meta Tags -->
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:author" content="${config.SITE_NAME}" />
    <meta property="article:section" content="Novosti" />
    
    <!-- Additional Meta Tags -->
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow" />
    
    <!-- Preload and redirect script -->
    <script>
      // Immediate redirect for regular users (not bots)
      if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.replace('${url}');
      } else {
        // Small delay for bots to read meta tags
        setTimeout(() => window.location.replace('${url}'), 500);
      }
    </script>
    
    <!-- Fallback meta refresh for no-JS -->
    <noscript>
      <meta http-equiv="refresh" content="0; url=${url}" />
    </noscript>
    
    <!-- Minimal styling for loading page -->
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #F8F9FA;
        margin: 0;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        color: #133d7d;
      }
      .container {
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 500px;
      }
      .logo { width: 60px; height: 60px; margin: 0 auto 20px; }
      h1 { margin: 0 0 10px; font-size: 24px; }
      p { margin: 0 0 20px; color: #666; line-height: 1.5; }
      .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #133d7d;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .link { color: #133d7d; text-decoration: none; font-weight: 600; }
      .link:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="${config.DEFAULT_IMAGE}" alt="${config.SITE_NAME} Logo" class="logo" />
      <h1>${escapedTitle}</h1>
      <p>${escapedDescription}</p>
      <div class="spinner"></div>
      <p>Učitavanje članka...</p>
      <a href="${url}" class="link">Kliknite ovdje ako se stranica ne učita automatski</a>
    </div>
  </body>
</html>`;
}

// Generate default site HTML
function generateDefaultHTML(config = DEFAULT_CONFIG) {
  return `<!DOCTYPE html>
<html lang="hr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="${config.DEFAULT_IMAGE}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.DEFAULT_TITLE}</title>
    
    <!-- Default Meta Tags -->
    <meta name="description" content="${config.DEFAULT_DESCRIPTION}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${config.DEFAULT_TITLE}" />
    <meta property="og:description" content="${config.DEFAULT_DESCRIPTION}" />
    <meta property="og:image" content="${config.DEFAULT_IMAGE}" />
    <meta property="og:url" content="${config.SITE_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${config.SITE_NAME}" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.DEFAULT_TITLE}" />
    <meta name="twitter:description" content="${config.DEFAULT_DESCRIPTION}" />
    <meta name="twitter:image" content="${config.DEFAULT_IMAGE}" />
    
    <!-- Redirect to main site -->
    <script>window.location.replace('${config.SITE_URL}');</script>
    <noscript><meta http-equiv="refresh" content="0; url=${config.SITE_URL}" /></noscript>
  </head>
  <body>
    <p>Redirecting to <a href="${config.SITE_URL}">${config.SITE_NAME}</a>...</p>
  </body>
</html>`;
}

// Main worker handler
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const userAgent = request.headers.get('User-Agent') || '';
      
      // Only handle requests with article parameter
      const articleId = url.searchParams.get('article');
      if (!articleId) {
        // Pass through to origin for non-article requests
        return fetch(request);
      }
      
      console.log(`Article request: ${articleId}, User-Agent: ${userAgent}`);
      
      // Check if this is a social media bot or crawler
      const isBot = isSocialMediaBot(userAgent);
      
      // For regular users, we can optionally pass through to the SPA
      // For bots, we MUST serve the HTML with meta tags
      if (!isBot) {
        // Optional: serve meta tags to all users for consistency
        // return fetch(request);
      }
      
      // Fetch article data from Supabase
      const supabase = createSupabaseClient(env);
      const article = await supabase.fetchArticle(articleId);
      
      if (!article) {
        console.log(`Article ${articleId} not found`);
        // Return default HTML or pass through to SPA
        return new Response(generateDefaultHTML(), {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=300', // 5 minutes cache
          },
        });
      }
      
      console.log(`Serving article: ${article.title}`);
      
      // Generate and return HTML with proper meta tags
      const html = generateArticleHTML(article);
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=3600', // 1 hour cache for articles
          'X-Served-By': 'Cloudflare-Worker',
          'X-Article-Id': articleId,
        },
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      
      // Fallback: pass through to origin on error
      return fetch(request);
    }
  },
};