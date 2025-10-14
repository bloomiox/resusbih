// Environment validation utility
export const validateEnvironment = () => {
  const requiredEnvVars = {
    VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    VITE_CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
    VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
    return false;
  }

  return true;
};

export const getCloudinaryConfig = () => {
  if (!validateEnvironment()) {
    throw new Error('Cloudinary configuration is incomplete. Check your .env file.');
  }

  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  };
};