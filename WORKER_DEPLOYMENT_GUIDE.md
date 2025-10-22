# Cloudflare Worker Deployment Guide

## 🚀 **Quick Setup Steps**

### **1. Install Wrangler (if not already installed)**
```bash
npm install -g wrangler
# or
pnpm add -g wrangler
```

### **2. Login to Cloudflare**
```bash
wrangler login
```
This opens your browser to authenticate with Cloudflare.

### **3. Set Environment Variables**
```bash
wrangler secret put VITE_SUPABASE_ANON_KEY
```
When prompted, paste your Supabase key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5d21uaHdyemVidWJtbmltZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTYyNzksImV4cCI6MjA3MzgzMjI3OX0.M9WQvNBzzMcaeWt0Ozr8iM66NCGgLhJAQX5r3hkv83c
```

### **4. Deploy the Worker**
```bash
wrangler deploy
```

### **5. Configure Custom Domain (Important!)**
In Cloudflare Dashboard:
1. Go to **Workers & Pages**
2. Select **resusbih-meta-tags**
3. Go to **Settings** > **Triggers**
4. Click **Add Custom Domain**
5. Enter: `resusbih.org`
6. This makes the worker handle all requests to your domain

## 🔧 **How It Will Work**

### **Before (Current):**
- Social media gets static HTML files
- Limited to pre-generated articles
- Build process required for new articles

### **After (With Worker):**
- Social media gets dynamic HTML with real-time data
- Works for ALL articles immediately
- No build process needed for new articles

### **Request Flow:**
```
User/Bot → resusbih.org/news?article=9
    ↓
Cloudflare Worker intercepts
    ↓
Fetches article from Supabase
    ↓
Generates HTML with meta tags
    ↓
Returns to user/bot
```

## 🧪 **Testing Steps**

### **1. Test Locally (Optional)**
```bash
npm run worker:dev
# Test: http://localhost:8787/news?article=9
```

### **2. Test Production**
After deployment, test with:
```bash
# Test bot user agent
curl -H "User-Agent: facebookexternalhit/1.1" "https://resusbih.org/news?article=9"
```

### **3. Validate Social Media**
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Enter**: `https://resusbih.org/news?article=9`
- **Should show**: Real article title, description, and image

## ⚡ **Benefits**

### **Immediate:**
- ✅ **All articles work** - No more missing descriptions
- ✅ **Real-time updates** - Edit article, sharing works instantly
- ✅ **Better performance** - Edge caching worldwide

### **Long-term:**
- ✅ **Zero maintenance** - No build scripts or static files
- ✅ **Unlimited articles** - Scales automatically
- ✅ **Better SEO** - Dynamic meta tags for search engines

## 🔄 **Migration Plan**

### **Phase 1: Deploy Worker**
1. Deploy the worker
2. Configure custom domain
3. Test social media sharing

### **Phase 2: Clean Up (After Testing)**
1. Remove static HTML files
2. Remove build scripts
3. Update documentation

### **Phase 3: Monitor**
1. Check Cloudflare analytics
2. Monitor social media sharing
3. Optimize as needed

## 🚨 **Important Notes**

### **Domain Configuration:**
- **Critical**: Must configure custom domain in Cloudflare
- **Without it**: Worker won't intercept requests to resusbih.org
- **With it**: All requests go through worker first

### **Fallback Behavior:**
- **If worker fails**: Requests pass through to your SPA
- **If database fails**: Returns default meta tags
- **If article not found**: Returns site defaults

This solution will give you **perfect social media sharing** for all articles with **zero ongoing maintenance**! 🎯