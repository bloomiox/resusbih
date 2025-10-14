# Cloudinary Setup Instructions

## 1. Environment Configuration
1. Copy `.env.example` to `.env` if not already done
2. Update the following values in your `.env` file:
   - `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `VITE_CLOUDINARY_API_KEY`: Your API key (already set: 642342664643333)
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Upload preset name (resusbih_news)

## 2. Get Your Cloud Name
1. Log in to your Cloudinary dashboard
2. Find your cloud name in the dashboard URL: `https://console.cloudinary.com/console/c-{YOUR_CLOUD_NAME}/`
3. Update `VITE_CLOUDINARY_CLOUD_NAME` in your `.env` file

## 3. Create Upload Preset (CRITICAL STEP)
**This step is required for uploads to work!**

1. Log in to your Cloudinary dashboard: https://console.cloudinary.com/
2. Go to **Settings** (gear icon) > **Upload**
3. Scroll down to **"Upload presets"** section
4. Click **"Add upload preset"**
5. Configure the preset:
   - **Preset name**: `resusbih_news` (must match exactly)
   - **Signing Mode**: **Unsigned** (very important!)
   - **Use filename or externally defined Public ID**: Checked
   - **Unique filename**: Checked (recommended)
   - **Folder**: `news` (optional but recommended)
   - **Allowed formats**: `jpg,png,gif,webp,jpeg`
   - **Max file size**: `10000000` (10MB in bytes)
   - **Max image width**: `2000` (optional)
   - **Max image height**: `2000` (optional)
6. Click **"Save"**

### ⚠️ Important Notes:
- **Signing Mode MUST be "Unsigned"** - this is the most common issue
- The preset name must be exactly `resusbih_news`
- If you use a different preset name, update it in your `.env` file

## 4. Security Notes
- The API key and secret you provided are now configured
- For production, consider using signed uploads for better security
- The current setup uses unsigned uploads which are suitable for public content

## 5. Features Implemented
- ✅ Main image upload for news articles
- ✅ Gallery images upload (multiple images)
- ✅ Image preview and removal
- ✅ Progress indicator during upload
- ✅ File type and size validation
- ✅ Cloudinary integration with proper folder structure

## 6. Folder Structure in Cloudinary
- `news/main/` - Main article images
- `news/gallery/` - Gallery images for articles

## 7. Usage
1. In Admin Panel > Novosti
2. Click "Dodaj novi članak" or edit existing article
3. Use "Glavna slika" section to upload the main article image
4. Use "Galerija slika" section to upload additional images
5. Images are automatically uploaded to Cloudinary and URLs are saved

## 8. Troubleshooting Upload Issues

### "Unauthorized" Error
**Most common cause**: Upload preset doesn't exist or is not set to "Unsigned"

**Solutions**:
1. **Check if preset exists**: Go to Cloudinary dashboard > Settings > Upload > Upload presets
2. **Verify preset name**: Must be exactly `resusbih_news`
3. **Check signing mode**: Must be "Unsigned"
4. **Create preset if missing**: Follow step 3 above

### "Invalid cloud name" Error
**Cause**: Wrong cloud name in environment variables

**Solution**:
1. Check your Cloudinary dashboard URL: `https://console.cloudinary.com/console/c-{YOUR_CLOUD_NAME}/`
2. Update `VITE_CLOUDINARY_CLOUD_NAME` in your `.env` file
3. Restart your development server

### Network/CORS Errors
**Cause**: Browser blocking requests or network issues

**Solutions**:
1. Check browser console for CORS errors
2. Ensure you're using HTTPS in production
3. Verify Cloudinary service is accessible

### Debug Steps
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try uploading an image
4. Check the console logs for detailed error information
5. Look for the "Uploading to Cloudinary with config" log to verify configuration

### Quick Test
You can test your upload preset manually:
1. Go to your Cloudinary dashboard
2. Navigate to Media Library
3. Try uploading an image using the same preset
4. If it works there, the issue is in the code configuration