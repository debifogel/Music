import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = import.meta.env.VITE_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_ACCESS_KEY;
const SECRET_ACCESS_KEY = import.meta.env.VITE_SECRET_KEY;
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET;
const FOLDER_NAME = import.meta.env.VITE_FOLDER_NAME || "";

if (!REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
  throw new Error("Missing AWS configuration. Please check your environment variables.");
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

interface UploadResponse {
  Key: string;
  Location: string;
  Bucket: string;
}

const S3Service = {
  uploadFile: async (
    file: File,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const Key = `${FOLDER_NAME}${fileName}`;

    // שלב 1: צור כתובת PUT חתומה
    const presignedUrl = await S3Service.generatePresignedUploadUrl(Key, file.type);

    // שלב 2: העלאה עם XMLHttpRequest
    await uploadFileWithProgress(file, presignedUrl, onProgress);

    return {
      Key,
      Location: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${Key}`,
      Bucket: BUCKET_NAME,
    };
  },

  generatePresignedUploadUrl: async (key: string, contentType: string): Promise<string> => {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
  },

  deleteFile: async (fileName: string): Promise<void> => {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
  },

  generatePresignedUrl: async (objectKey: string): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 60 * 15 });
  },
};

async function uploadFileWithProgress(
  file: File,
  url: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.send(file);
  });
}

export default S3Service;
