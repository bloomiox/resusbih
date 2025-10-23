// Cloudflare Pages Function for dynamic article meta tags
// This function intercepts requests and generates HTML with proper meta tags for social media crawlers

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
    
    <!-- Minimal styling for bot content -->
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #F8F9FA;
        margin: 0;
        padding: 20px;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .logo { width: 60px; height: 60px; margin: 0 auto 20px; display: block; }
      h1 { margin: 0 0 20px; font-size: 28px; color: #133d7d; }
      .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
      .content { margin: 20px 0; }
      .article-image { width: 100%; max-width: 600px; height: auto; margin: 20px 0; border-radius: 8px; }
      .link { color: #133d7d; text-decoration: none; font-weight: 600; }
      .link:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="${config.DEFAULT_IMAGE}" alt="${config.SITE_NAME} Logo" class="logo" />
      <h1>${escapedTitle}</h1>
      <div class="meta">Objavljeno: ${new Date(publishedTime).toLocaleDateString('hr-HR')}</div>
      ${image !== config.DEFAULT_IMAGE ? `<img src="${image}" alt="${escapedTitle}" class="article-image" />` : ''}
      <div class="content">
        <p>${escapedDescription}</p>
      </div>
      <p><a href="${url}" class="link">Pročitajte cijeli članak na ${config.SITE_NAME}</a></p>
    </div>
  </body>
</html>`;
}

// Main Pages Function handler
export async function onRequest(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // Only handle /news requests with article parameter
    if (url.pathname !== '/news') {
      return env.ASSETS.fetch(request);
    }
    
    const articleId = url.searchParams.get('article');
    if (!articleId) {
      // No article parameter - serve normal page
      return env.ASSETS.fetch(request);
    }
    
    console.log(`Article request: ${articleId}, User-Agent: ${userAgent}`);
    
    // Check if this is a social media bot or crawler
    const isBot = isSocialMediaBot(userAgent);
    console.log(`Bot detection result: ${isBot} for User-Agent: ${userAgent}`);
    
    // For regular users, serve the normal static site
    if (!isBot) {
      return env.ASSETS.fetch(request);
    }
    
    // For bots, fetch article data and serve meta tags HTML
    const supabase = createSupabaseClient(env);
    const article = await supabase.fetchArticle(articleId);
    
    if (!article) {
      console.log(`Article ${articleId} not found`);
      // Serve normal page if article not found
      return env.ASSETS.fetch(request);
    }
    
    console.log(`Serving article meta tags: ${article.title}`);
    
    // Generate and return HTML with proper meta tags
    const html = generateArticleHTML(article);
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache for articles
        'X-Served-By': 'Cloudflare-Pages-Function',
        'X-Article-Id': articleId,
      },
    });
    
  } catch (error) {
    console.error('Pages Function error:', error);
    
    // Fallback: serve normal static site on error
    return context.env.ASSETS.fetch(context.request);
  }
}