import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  
  const REGION = import.meta.env.VITE_REGION!;
  const BUCKET = import.meta.env.VITE_S3_BUCKET!;
  const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY!;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY!;
  const FOLDER = import.meta.env.VITE_FOLDER_NAME || "";
  
  if (!REGION || !BUCKET || !ACCESS_KEY || !SECRET_KEY) {
    throw new Error("Missing AWS credentials or config.");
  }
  
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });
  
  interface UploadResponse {
    Location: string;
    Key: string;
    Bucket: string;
  }
  
  const S3Service = {
    uploadFile: async (
      file: File,
      fileName: string
    ): Promise<UploadResponse> => {
      const key = `${FOLDER}${fileName}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: file.type,
      });
  
      await s3.send(command);
  
      return {
        Location: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
        Key: key,
        Bucket: BUCKET,
      };
    },
  
    deleteFile: async (fileName: string) => {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: fileName,
      });
      return s3.send(command);
    },
  
    getFileUrl: (fileName: string): string => {
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    },
  
    generatePresignedUrl: async (objectKey: string): Promise<string> => {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: objectKey,
      });
  
      return getSignedUrl(s3, command, { expiresIn: 300 }); // 5 דקות
    },
  };
  
  export default S3Service;
  