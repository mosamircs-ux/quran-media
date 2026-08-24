import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env, logger, StorageError } from '@quran-media/config';
import fs from 'fs';

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
      forcePathStyle: env.S3_FORCE_PATH_STYLE,
    });
    logger.info('Initialized S3 Storage client');
  }
  return s3ClientInstance;
}

export async function uploadFileToS3(params: {
  key: string;
  filePath?: string;
  buffer?: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; location: string }> {
  const client = getS3Client();
  const body = params.buffer || (params.filePath ? fs.createReadStream(params.filePath) : null);

  if (!body) {
    throw new StorageError('No buffer or filePath provided for S3 upload');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: params.key,
      Body: body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    });

    await client.send(command);

    const location = env.S3_PUBLIC_DOMAIN
      ? `${env.S3_PUBLIC_DOMAIN.replace(/\/$/, '')}/${params.key}`
      : `${env.S3_ENDPOINT.replace(/\/$/, '')}/${env.S3_BUCKET}/${params.key}`;

    return { key: params.key, location };
  } catch (err) {
    logger.error({ err, key: params.key }, 'Failed to upload object to S3');
    throw new StorageError(`S3 upload failed for key: ${params.key}`, err);
  }
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600,
  filename?: string
): Promise<string> {
  const client = getS3Client();
  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      ResponseContentDisposition: filename ? `attachment; filename="${filename}"` : undefined,
    });

    return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  } catch (err) {
    throw new StorageError(`Failed to generate presigned download URL for key: ${key}`, err);
  }
}

export async function deleteObjectFromS3(key: string): Promise<void> {
  const client = getS3Client();
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    logger.warn({ err, key }, 'Failed to delete S3 object');
  }
}
