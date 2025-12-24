import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize R2 client
const getR2Client = () => {
  const R2_ACCOUNT_ID = process.env.VITE_R2_ACCOUNT_ID?.trim();
  const R2_ACCESS_KEY_ID = process.env.VITE_R2_ACCESS_KEY_ID?.trim();
  const R2_SECRET_ACCESS_KEY = process.env.VITE_R2_SECRET_ACCESS_KEY?.trim();

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Missing key' });
    }

    // Delete from R2
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: process.env.VITE_R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error('R2 delete error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Delete failed',
    });
  }
}

