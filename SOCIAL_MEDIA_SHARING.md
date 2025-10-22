# Social Media Sharing & Open Graph Implementation

## ✅ **Implemented Features**

### **🏷️ Dynamic Meta Tags**
- **Open Graph (OG) tags** for Facebook, LinkedIn sharing
- **Twitter Card tags** for Twitter sharing  
- **Dynamic title and description** based on article content
- **Article-specific images** for rich social media previews

### **📱 Social Media Platform Support**

#### **Facebook & LinkedIn**
- **og:title** - Article title or site title
- **og:description** - Article description or site description
- **og:image** - Article image or default logo
- **og:url** - Direct link to the article
- **og:type** - "article" for news, "website" for pages
- **og:site_name** - "RESUSBIH"

#### **Twitter**
- **twitter:card** - "summary_large_image" for large image previews
- **twitter:title** - Article title or site title
- **twitter:description** - Article description or site description
- **twitter:image** - Article image or default logo

### **🔄 Dynamic Updates**
- **Article selection** → Updates meta tags with article data
- **Article deselection** → Resets to default site meta tags
- **Page navigation** → Updates meta tags per page
- **URL sharing** → Social platforms read current meta tags

## 🎯 **How It Works**

### **Default Meta Tags (Site Level)**
```html
<meta property="og:title" content="Udruženje Resuscitacijski savjet u Bosni i Hercegovini" />
<meta property="og:description" content="Znanje koje spašava živote..." />
<meta property="og:image" content="https://pub-7d86d5f2e97b46c0a2c2ed8485d9788b.r2.dev/RESUSBIH%20LOGO.png" />
```

### **Article-Specific Meta Tags**
```html
<meta property="og:title" content="Article Title | RESUSBIH" />
<meta property="og:description" content="Article short description..." />
<meta property="og:image" content="https://cloudinary.com/article-image.jpg" />
<meta property="og:url" content="https://resusbih.org/news?article=123" />
<meta property="og:type" content="article" />
```

## 🔧 **Technical Implementation**

### **Meta Tags Manager**
- **Dynamic tag creation/removal** via JavaScript
- **Automatic cleanup** when switching articles
- **Fallback to defaults** when no article is selected
- **Console logging** for debugging in development

### **React Integration**
- **useEffect hooks** for meta tag updates
- **Component lifecycle** management
- **URL parameter detection** for shared links
- **Automatic updates** on article selection

### **URL Structure**
- **Article URLs**: `https://resusbih.org/news?article=123`
- **Meta tag URL**: Matches the shareable URL exactly
- **Canonical URLs**: Consistent across all platforms

## 📊 **Social Media Preview Results**

### **When Sharing an Article:**
- **Title**: "Article Title | RESUSBIH"
- **Description**: Article's short description
- **Image**: Article's main image (or default logo)
- **URL**: Direct link to the article

### **When Sharing Site/News Page:**
- **Title**: "Novosti | RESUSBIH" or site title
- **Description**: Site description
- **Image**: RESUSBIH logo
- **URL**: Site or news page URL

## 🛠️ **Development Tools**

### **Debug Commands**
Run in browser console:
```javascript
// Check current meta tags
debugMetaTags()

// Test Cloudinary config
testCloudinaryConfig()
```

### **Meta Tag Validation**
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

## 🚀 **Testing Social Media Sharing**

### **Step 1: Share Article Link**
1. Open any news article
2. Click "Podijeli" button
3. Copy the generated link
4. Paste in social media platform

### **Step 2: Verify Rich Preview**
- **Facebook**: Should show article image, title, description
- **Twitter**: Should show large image card with article details
- **LinkedIn**: Should show professional preview with article info
- **WhatsApp**: Should show link preview with image

### **Step 3: Debug Issues**
1. Use browser console: `debugMetaTags()`
2. Check Facebook Debugger with your URL
3. Verify meta tags are updating correctly
4. Test with different articles

## 📱 **Platform-Specific Notes**

### **Facebook**
- **Caches previews** - use Facebook Debugger to refresh
- **Requires HTTPS** for images in production
- **Image size**: Minimum 200x200px, recommended 1200x630px

### **Twitter**
- **Large image cards** for better engagement
- **Image aspect ratio**: 2:1 recommended
- **Alt text**: Automatically uses article title

### **LinkedIn**
- **Professional appearance** with clean formatting
- **Business-focused** preview style
- **Company page** integration possible

### **WhatsApp**
- **Automatic link previews** on mobile
- **Image thumbnails** for quick recognition
- **Direct sharing** via WhatsApp Web API

## 🔄 **Future Enhancements**

### **Potential Improvements**
- **Server-side rendering** for better SEO
- **Image optimization** for faster loading
- **A/B testing** for preview formats
- **Analytics tracking** for social shares
- **Custom images** per social platform