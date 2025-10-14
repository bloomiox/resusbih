import React, { useState, useRef } from 'react';
import { uploadToCloudinary, CloudinaryUploadResult } from '../../services/cloudinaryService';

interface ImageUploadProps {
  onUpload: (imageUrl: string, publicId: string) => void;
  onRemove?: (publicId: string) => void;
  currentImage?: string;
  label: string;
  multiple?: boolean;
  folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  label,
  multiple = false,
  folder = 'news'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    
    let progressInterval: NodeJS.Timeout | null = null;

    try {
      const file = files[0]; // For now, handle single file upload
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Molimo odaberite sliku (JPG, PNG, GIF, itd.)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Slika je prevelika. Maksimalna veličina je 10MB.');
        return;
      }

      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result: CloudinaryUploadResult = await uploadToCloudinary(file, folder);
      
      if (progressInterval) clearInterval(progressInterval);
      setUploadProgress(100);
      
      onUpload(result.secure_url, result.public_id);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (progressInterval) clearInterval(progressInterval);
      
      let errorMessage = 'Greška pri učitavanju slike. ';
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('Unknown API key')) {
          errorMessage += 'Cloudinary konfiguracija nije ispravna. Provjerite API key i upload preset u Cloudinary dashboard-u.';
        } else if (error.message.includes('Invalid')) {
          errorMessage += 'Neispravni Cloudinary podaci. Provjerite cloud name.';
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    if (onRemove && currentImage) {
      // Extract public_id from URL if needed
      const publicId = currentImage.split('/').pop()?.split('.')[0] || '';
      onRemove(publicId);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {currentImage && (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="flex items-center space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-brand-blue hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>📁</span>
          <span>{uploading ? 'Učitavanje...' : 'Odaberi sliku'}</span>
        </button>

        {uploading && (
          <div className="flex-1 max-w-xs">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Podržani formati: JPG, PNG, GIF. Maksimalna veličina: 10MB.
      </p>
    </div>
  );
};

export default ImageUpload;