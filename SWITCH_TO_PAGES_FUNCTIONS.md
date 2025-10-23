# Switch from Cloudflare Worker to Pages Functions

## Why Switch?

The current issue is that the Cloudflare Worker is intercepting ALL requests to your domain, causing white screens for regular users. Pages Functions work better because they:

1. **Automatically handle static assets** - No need to configure routes
2. **Seamless integration** - Works alongside your static site
3. **Better performance** - Direct access to static files
4. **Easier debugging** - Clearer separation of concerns

## Steps to Switch

### 1. Remove Worker Routes

In Cloudflare Dashboard:
1. Go to **Workers & Pages**
2. Select your worker: **resusbih-meta-tags**
3. Go to **Settings** > **Triggers**
4. **Delete all routes** (remove `resusbih.org/news*` etc.)

### 2. Deploy Pages Function

The Pages Function is already created in `functions/[[path]].js`. To deploy it:

1. **Commit and push** the new function:
   ```bash
   git add functions/[[path]].js
   git commit -m "Add Pages Function for dynamic meta tags"
   git push
   ```

2. **Redeploy your Cloudflare Pages site** (this should happen automatically on push)

### 3. Set Environment Variables

In Cloudflare Pages (not Worker):
1. Go to **Pages** > **Your Site** > **Settings** > **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL`: `https://hywmnhwrzebubmnimdow.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5d21uaHdyemVidWJtbmltZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTYyNzksImV4cCI6MjA3MzgzMjI3OX0.M9WQvNBzzMcaeWt0Ozr8iM66NCGgLhJAQX5r3hkv83c`

### 4. Test the Setup

After deployment:

1. **Test regular user**: Visit `https://resusbih.org/news?article=9`
   - Should show the React app with article content
   
2. **Test bot**: 
   ```bash
   curl -H "User-Agent: facebookexternalhit/1.1" "https://resusbih.org/news?article=9"
   ```
   - Should return HTML with meta tags

## How Pages Functions Work

### Request Flow:
1. **User visits**: `https://resusbih.org/news?article=9`
2. **Pages Function checks**: Is this a bot? Does it have article parameter?
3. **For regular users**: Serves static React app via `env.ASSETS.fetch(request)`
4. **For bots**: Generates and serves HTML with meta tags
5. **For other pages**: Passes through to static hosting

### Benefits:
- ✅ **No route configuration needed** - Works automatically
- ✅ **Static assets served directly** - No worker overhead
- ✅ **Perfect SEO** - Bots get meta tags, users get full app
- ✅ **Easy debugging** - Clear logs in Pages dashboard

## Alternative: Fix Worker Routes (If You Prefer)

If you want to keep using the Worker instead, you need to:

1. **Remove broad routes** like `resusbih.org/*`
2. **Configure specific routes** that only match bot requests
3. **Set up proper fallback** to your static hosting

But Pages Functions are much easier and more reliable.

## Cleanup After Switch

Once Pages Functions are working:

1. **Delete the Worker**:
   ```bash
   wrangler delete resusbih-meta-tags
   ```

2. **Remove worker files** (optional):
   - `worker/index.js`
   - `wrangler.toml`

## Testing Commands

```bash
# Test regular user (should get React app)
curl "https://resusbih.org/news?article=9"

# Test bot (should get meta tags HTML)
curl -H "User-Agent: facebookexternalhit/1.1" "https://resusbih.org/news?article=9"

# Test Facebook debugger
# https://developers.facebook.com/tools/debug/

# Test Twitter validator  
# https://cards-dev.twitter.com/validator
```

This approach will solve the white screen issue and provide a much more reliable solution! 🎯