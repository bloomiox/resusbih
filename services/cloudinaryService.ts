import { Cloudinary } from '@cloudinary/url-gen';
import { getCloudinaryConfig } from '../utils/envValidation';

// Get validated Cloudinary configuration
const config = getCloudinaryConfig();

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: config.cloudName
  }
});

// Cloudinary upload configuration
export const CLOUDINARY_CONFIG = config;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'news'
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  console.log('Uploading to Cloudinary with config:', {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder
  });

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error response:', result);
      throw new Error(`Upload failed: ${result.error?.message || response.statusText}`);
    }

    console.log('Upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // Note: Deletion requires server-side implementation with API secret
  // This is a placeholder for future server-side implementation
  console.log('Delete operation requires server-side implementation:', publicId);
};

export default cloudinary;