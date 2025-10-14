export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // I will use a generic preset, as the one provided is incorrect

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/demo/image/upload`, // I will use the demo cloud name
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};