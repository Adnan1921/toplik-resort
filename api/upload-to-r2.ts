import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize R2 client
const getR2Client = () => {
  const R2_ACCOUNT_ID = process.env.VITE_R2_ACCOUNT_ID;
  const R2_ACCESS_KEY_ID = process.env.VITE_R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.VITE_R2_SECRET_ACCESS_KEY;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
    requestHandler: {
      requestTimeout: 30000,
    },
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, fileName, folder } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ error: 'Missing file or fileName' });
    }

    // Decode base64 file
    const buffer = Buffer.from(file, 'base64');
    const key = folder ? `${folder}/${fileName}` : fileName;

    // Upload to R2
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.VITE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg', // Adjust based on file type
    });

    await client.send(command);

    // Generate public URL
    const publicUrl = `${process.env.VITE_R2_PUBLIC_URL}/${key}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      key: key,
    });
  } catch (error: any) {
    console.error('R2 upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
}

