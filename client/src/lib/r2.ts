// Cloudflare R2 Storage Integration
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import imageCompression from 'browser-image-compression';

const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

export const isR2Configured = () => {
  return R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME;
};

// Initialize R2 client
const getR2Client = () => {
  if (!isR2Configured()) {
    throw new Error('R2 is not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
};

interface UploadOptions {
  file: File;
  folder?: string;
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

/**
 * Compress image before upload
 */
const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed, using original:', error);
    return file;
  }
};

/**
 * Generate unique filename
 */
const generateFileName = (originalName: string, folder?: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  
  const fileName = `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
  return folder ? `${folder}/${fileName}` : fileName;
};

/**
 * Upload file to R2
 */
export const uploadToR2 = async (options: UploadOptions): Promise<UploadResult> => {
  if (!isR2Configured()) {
    return { success: false, error: 'R2 is not configured' };
  }

  try {
    let fileToUpload = options.file;

    // Compress image if requested and file is an image
    if (options.compress && options.file.type.startsWith('image/')) {
      fileToUpload = await compressImage(
        options.file,
        options.maxSizeMB || 1,
        options.maxWidthOrHeight || 1920
      );
    }

    const key = generateFileName(options.file.name, options.folder);
    const client = getR2Client();

    // Use multipart upload for better progress tracking
    const upload = new Upload({
      client,
      params: {
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileToUpload,
        ContentType: fileToUpload.type,
      },
    });

    // Track progress
    if (options.onProgress) {
      upload.on('httpUploadProgress', (progress) => {
        if (progress.loaded && progress.total) {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          options.onProgress!(percentage);
        }
      });
    }

    await upload.done();

    const url = `${R2_PUBLIC_URL}/${key}`;
    
    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Delete file from R2
 */
export const deleteFromR2 = async (key: string): Promise<{ success: boolean; error?: string }> => {
  if (!isR2Configured()) {
    return { success: false, error: 'R2 is not configured' };
  }

  try {
    const client = getR2Client();
    
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );

    return { success: true };
  } catch (error) {
    console.error('R2 delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};

/**
 * List files in R2 bucket
 */
export const listR2Files = async (
  prefix?: string,
  maxKeys: number = 100
): Promise<{ success: boolean; files?: Array<{ key: string; url: string; size: number; lastModified: Date }>; error?: string }> => {
  if (!isR2Configured()) {
    return { success: false, error: 'R2 is not configured' };
  }

  try {
    const client = getR2Client();
    
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys,
      })
    );

    const files = (response.Contents || []).map((item) => ({
      key: item.Key!,
      url: `${R2_PUBLIC_URL}/${item.Key}`,
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
    }));

    return { success: true, files };
  } catch (error) {
    console.error('R2 list error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List failed',
    };
  }
};

/**
 * Get public URL for a file
 */
export const getR2Url = (key: string): string => {
  return `${R2_PUBLIC_URL}/${key}`;
};

