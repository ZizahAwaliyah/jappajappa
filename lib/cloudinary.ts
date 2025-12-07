import { CldUploadWidget } from "next-cloudinary";

// Utility untuk upload ke Cloudinary
export const uploadToCloudinary = async (
  file: File,
  folder: string = "jappajappa"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("folder", folder);

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    // Validasi environment variables
    if (!cloudName) {
      throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME tidak dikonfigurasi di .env.local");
    }
    if (!uploadPreset) {
      throw new Error("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET tidak dikonfigurasi di .env.local. Buat unsigned upload preset di Cloudinary Console.");
    }

    console.log("Uploading to Cloudinary:", { cloudName, uploadPreset, folder, fileName: file.name });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    
    console.log("Cloudinary response status:", response.status);
    console.log("Cloudinary response data:", data);
    
    if (!response.ok) {
      console.error("Cloudinary error details:", {
        status: response.status,
        statusText: response.statusText,
        errorMessage: data.error?.message,
        fullError: data.error,
      });
      throw new Error(
        data.error?.message || 
        `Upload failed with status ${response.status}: ${response.statusText}`
      );
    }

    console.log("Upload successful:", data.secure_url);
    return data.secure_url; // Return URL gambar
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    throw error;
  }
};

// Utility untuk generate Cloudinary URL dengan transformasi
export const getCloudinaryUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  const transformations = [];
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);

  const transform = transformations.length ? `/${transformations.join(",")}` : "";
  return `${baseUrl}${transform}/${publicId}`;
};
