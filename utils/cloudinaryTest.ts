// Cloudinary configuration test utility
export const testCloudinaryConfig = () => {
  console.log('=== Cloudinary Configuration Test ===');
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  console.log('Cloud Name:', cloudName);
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
  console.log('Upload Preset:', uploadPreset);
  
  // Test if we can reach Cloudinary
  const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  console.log('Upload URL:', testUrl);
  
  // Test preset existence (this will fail but show us the error)
  fetch(testUrl, {
    method: 'POST',
    body: new FormData() // Empty form data
  })
  .then(response => response.json())
  .then(data => {
    console.log('Cloudinary response:', data);
    if (data.error) {
      if (data.error.message.includes('Upload preset')) {
        console.error('❌ Upload preset issue:', data.error.message);
        console.log('💡 Solution: Create upload preset "' + uploadPreset + '" in Cloudinary dashboard');
      } else {
        console.error('❌ Other error:', data.error.message);
      }
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error);
    console.log('💡 Check if cloud name is correct and Cloudinary is accessible');
  });
};

// Make available in development
if (import.meta.env.VITE_NODE_ENV === 'development') {
  (window as any).testCloudinaryConfig = testCloudinaryConfig;
}