#!/bin/bash

# Simple script to generate article pages locally
# Run this whenever you add new articles

echo "🚀 Generating article pages for social media sharing..."

# Run the generation script
node scripts/generateArticlePages.mjs

echo "✅ Article pages generated!"
echo "📁 Check the /public directory for article-*.html files"
echo "🔗 These URLs will now work for social media sharing:"
echo "   https://resusbih.org/article-1.html"
echo "   https://resusbih.org/article-2.html"
echo "   etc..."