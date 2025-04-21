import {
    S3Client,
    
    DeleteObjectCommand,
    GetObjectCommand,
  } from "@aws-sdk/client-s3";
  import { Upload } from "@aws-sdk/lib-storage";
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
  
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: BUCKET_NAME,
          Key,
          Body: file,
          ContentType: file.type,
        },
      });
  
      if (onProgress) {
        upload.on("httpUploadProgress", (progress) => {
          if (progress.loaded && progress.total) {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            onProgress(percentage);
          }
        });
      }
  
  
      return {
        Key,
        Location: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${Key}`,
        Bucket: BUCKET_NAME,
      };
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
  
      const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes
  
      return url;
    },
  };
  
  export default S3Service;
  