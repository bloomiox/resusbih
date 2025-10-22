# Automated Article Page Generation

## 🎯 **What This Solves**
Automatically generates static HTML files for **all articles** in your database, ensuring social media sharing works perfectly for every article without manual work.

## 🔧 **How It Works**

### **1. Build Process Integration**
- **Runs automatically** during `npm run build`
- **Fetches all articles** from Supabase database
- **Generates static HTML files** with proper meta tags
- **Deploys with your site** to Cloudflare Pages

### **2. Generated Files**
For each article in your database, creates:
```
/public/article-1.html
/public/article-2.html  
/public/article-3.html
...
```

### **3. Social Media URLs**
- **Facebook/Twitter/LinkedIn**: `https://resusbih.org/article-X.html`
- **Rich previews**: Title, description, and image from database
- **User redirect**: Automatically redirects to `/news?article=X`

## 🚀 **Usage**

### **Automatic (Recommended)**
1. **Push code to GitHub** → Triggers automatic generation
2. **Cloudflare Pages builds** → Includes all article pages
3. **Social sharing works** → For all articles automatically

### **Manual Generation**
Run locally when you add new articles:

**Windows:**
```cmd
generate-articles.bat
```

**Mac/Linux:**
```bash
./generate-articles.sh
```

**Direct command:**
```bash
npm run generate-articles
```

## 📋 **What Gets Generated**

### **For Each Article:**
```html
<!-- /public/article-123.html -->
<meta property="og:title" content="Article Title | RESUSBIH" />
<meta property="og:description" content="Article description..." />
<meta property="og:image" content="https://cloudinary.com/image.jpg" />
<meta property="og:url" content="https://resusbih.org/news?article=123" />
<script>
  setTimeout(() => window.location.href = '/news?article=123', 100);
</script>
```

### **Features:**
- ✅ **Proper Open Graph tags** for all social platforms
- ✅ **Twitter Card support** with large images
- ✅ **Article-specific data** (title, description, image)
- ✅ **Automatic redirect** to SPA after meta tags are read
- ✅ **Fallback for no-JS** users
- ✅ **Professional loading page** during redirect

## 🔄 **Deployment Process**

### **Cloudflare Pages Build:**
1. **Code pushed** to GitHub
2. **Dependencies installed** (`npm install`)
3. **Articles generated** (`npm run generate-articles`)
4. **Site built** (`vite build`)
5. **Deployed** with all article pages

### **Environment Variables:**
Ensure these are set in Cloudflare Pages:
```
VITE_SUPABASE_URL=https://hywmnhwrzebubmnimdow.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 📊 **Results**

### **Before (Manual):**
- ❌ Only worked for manually created articles
- ❌ Required creating HTML file for each article
- ❌ Easy to forget for new articles

### **After (Automated):**
- ✅ **Works for ALL articles** automatically
- ✅ **New articles included** in next deployment
- ✅ **Zero manual work** required
- ✅ **Consistent social media previews**

## 🧪 **Testing**

### **Verify Generation:**
1. **Run script locally**: `npm run generate-articles`
2. **Check files created**: Look in `/public/article-*.html`
3. **Test social sharing**: Use Facebook Debugger with generated URLs

### **Social Media Validation:**
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **Test URL**: `https://resusbih.org/article-X.html`

## 🔧 **Customization**

### **Update Template:**
Edit `scripts/generateArticlePages.mjs` to:
- **Change HTML structure**
- **Add more meta tags**
- **Modify redirect behavior**
- **Update styling**

### **Add More Data:**
Modify the Supabase query to include:
- **Author information**
- **Publication date**
- **Article categories**
- **Gallery images**

## 📈 **Benefits**

### **SEO & Social Media:**
- ✅ **Rich social media previews** for all articles
- ✅ **Better click-through rates** from social platforms
- ✅ **Professional appearance** on Facebook, Twitter, LinkedIn
- ✅ **Consistent branding** across all shared content

### **Maintenance:**
- ✅ **Zero ongoing work** - fully automated
- ✅ **Scales automatically** with new articles
- ✅ **Always up-to-date** with latest content
- ✅ **No manual file creation** needed

## 🚨 **Important Notes**

### **Database Requirements:**
- Articles must have: `id`, `title`, `short_description`
- Optional: `image_url` (falls back to logo)
- Table: `news_articles` in Supabase

### **URL Structure:**
- **Social sharing**: `/article-X.html` (static with meta tags)
- **User experience**: `/news?article=X` (SPA with full functionality)
- **Redirect**: Automatic from static to SPA

This solution ensures **every article** you publish will have perfect social media sharing without any manual work! 🎯