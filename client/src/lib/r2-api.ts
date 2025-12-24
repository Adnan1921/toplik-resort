// R2 upload via Vercel API (server-side)
import imageCompression from 'browser-image-compression';

interface UploadOptions {
  file: File;
  folder: string;
  compress?: boolean;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// Compress image before upload
async function compressImage(file: File, maxSizeMB: number, maxWidthOrHeight: number): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const originalSize = (file.size / 1024 / 1024).toFixed(2);
    const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
    console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
}

// Convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Upload file to R2 via API
export async function uploadToR2API(options: UploadOptions): Promise<UploadResult> {
  const {
    file,
    folder,
    compress = true,
    maxSizeMB = 2,
    maxWidthOrHeight = 1920,
    onProgress,
  } = options;

  try {
    // Compress image if needed
    let fileToUpload = file;
    if (compress && file.type.startsWith('image/')) {
      onProgress?.(10);
      fileToUpload = await compressImage(file, maxSizeMB, maxWidthOrHeight);
      onProgress?.(30);
    }

    // Convert to base64
    const base64File = await fileToBase64(fileToUpload);
    onProgress?.(50);

    // Upload via API
    const response = await fetch('/api/upload-to-r2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64File,
        fileName: file.name,
        folder,
      }),
    });

    onProgress?.(90);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    onProgress?.(100);

    return {
      success: true,
      url: result.url,
      key: result.key,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

// Delete file from R2 via API
export async function deleteFromR2API(key: string): Promise<UploadResult> {
  try {
    const response = await fetch('/api/delete-from-r2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message || 'Delete failed',
    };
  }
}

