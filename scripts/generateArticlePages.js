#!/usr/bin/env node

// Script to generate static HTML files for all articles
// This ensures social media sharing works for all articles

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hywmnhwrzebubmnimdow.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5d21uaHdyemVidWJtbmltZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTYyNzksImV4cCI6MjA3MzgzMjI3OX0.M9WQvNBzzMcaeWt0Ozr8iM66NCGgLhJAQX5r3hkv83c';

const supabase = createClient(supabaseUrl, supabaseKey);

// Default fallback image
const defaultImage = 'https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png';
const siteUrl = 'https://resusbih.org';

// HTML template for article pages
const generateArticleHTML = (article) => {
  const title = article.title.replace(/"/g, '&quot;');
  
  // Use short_description, or fallback to truncated full_content, or default
  let description = article.short_description || '';
  if (!description && article.full_content) {
    // Use first 150 characters of full content as fallback
    description = article.full_content.substring(0, 150).replace(/\n/g, ' ').trim();
    if (description.length === 150) {
      description += '...';
    }
  }
  if (!description) {
    description = 'Pročitajte najnovije vijesti iz Udruženja Resuscitacijski savjet u Bosni i Hercegovini.';
  }
  description = description.replace(/"/g, '&quot;');
  
  const image = article.image_url || defaultImage;
  const url = `${siteUrl}/news?article=${article.id}`;
  
  return `<!DOCTYPE html>
<html lang="hr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="${defaultImage}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | RESUSBIH</title>
    
    <!-- Article-specific Meta Tags -->
    <meta name="description" content="${description}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${title} | RESUSBIH" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="RESUSBIH" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title} | RESUSBIH" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    
    <!-- Additional Meta Tags -->
    <meta property="article:published_time" content="${article.created_at}" />
    <meta property="article:author" content="RESUSBIH" />
    <meta property="article:section" content="Novosti" />
    
    <!-- Redirect to main app -->
    <script>
      // Small delay to ensure social media crawlers can read meta tags
      setTimeout(function() {
        window.location.href = '${url}';
      }, 100);
    </script>
    
    <!-- Fallback for users with JavaScript disabled -->
    <noscript>
      <meta http-equiv="refresh" content="0; url=${url}" />
    </noscript>
    
    <style>
      body {
        font-family: Inter, sans-serif;
        background-color: #F8F9FA;
        margin: 0;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .container {
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
      }
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
      }
      h1 {
        color: #133d7d;
        margin-bottom: 10px;
        font-size: 24px;
      }
      p {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .link {
        color: #133d7d;
        text-decoration: none;
        font-weight: 600;
      }
      .link:hover {
        text-decoration: underline;
      }
      .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #133d7d;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="${defaultImage}" alt="RESUSBIH Logo" class="logo" />
      <h1>${title}</h1>
      <p>${description}</p>
      <div class="spinner"></div>
      <p>Preusmjeravamo vas na članak...</p>
      <a href="${url}" class="link">Kliknite ovdje ako se ne preusmjerite automatski</a>
    </div>
  </body>
</html>`;
};

// Main function to generate all article pages
async function generateArticlePages() {
  try {
    console.log('🚀 Starting article page generation...');
    
    // Fetch all articles from Supabase
    const { data: articles, error } = await supabase
      .from('news_articles')
      .select('id, title, short_description, image_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    if (!articles || articles.length === 0) {
      console.log('⚠️  No articles found in database');
      return;
    }

    console.log(`📄 Found ${articles.length} articles to process`);

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate HTML file for each article
    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        const filename = `article-${article.id}.html`;
        const filepath = path.join(publicDir, filename);
        const html = generateArticleHTML(article);
        
        fs.writeFileSync(filepath, html, 'utf8');
        console.log(`✅ Generated: ${filename} - "${article.title}"`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed to generate article-${article.id}.html:`, err.message);
        errorCount++;
      }
    }

    // Generate index file with all articles
    const indexContent = `# Generated Article Pages

This directory contains automatically generated static HTML files for social media sharing.

## Generated Files (${successCount} total):

${articles.map(article => 
  `- [article-${article.id}.html](./article-${article.id}.html) - ${article.title}`
).join('\n')}

## Usage:
- Social media sharing: Use \`/article-X.html\` URLs
- Direct access: Users get redirected to \`/news?article=X\`

Generated on: ${new Date().toISOString()}
`;

    fs.writeFileSync(path.join(publicDir, 'articles-index.md'), indexContent, 'utf8');

    console.log('\n🎉 Article page generation completed!');
    console.log(`✅ Successfully generated: ${successCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} files`);
    }
    console.log(`📁 Files saved to: ${publicDir}`);

  } catch (error) {
    console.error('💥 Error generating article pages:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateArticlePages();
}

export { generateArticlePages };