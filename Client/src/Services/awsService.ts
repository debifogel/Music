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
     return await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 }); // תוקף של 5 דקות
  }
}
  
  export default S3Service;
  
//   import AWS from 'aws-sdk';

// // 1️⃣ יצירת פונקציה להחזרת הקונפיגורציה
// const getAWSConfig = () => {
//     const accessKeyId = import.meta.env.VITE_ACCESS_KEY;
//     const secretAccessKey = import.meta.env.VITE_SECRET_KEY;
//     const region = import.meta.env.VITE_REGION;

//     if (!accessKeyId || !secretAccessKey || !region) {
//         throw new Error("Missing AWS credentials. Please check your .env file.");
//     }

//     return {
//         accessKeyId,
//         secretAccessKey,
//         region,
//     };
// };

// // 2️⃣ טעינת הגדרות AWS
// AWS.config.update(getAWSConfig());
// AWS.config.credentials = new AWS.Credentials(
//     import.meta.env.VITE_ACCESS_KEY,
//     import.meta.env.VITE_SECRET_KEY
// );
// // 3️⃣ יצירת מופע של S3

// const s3 = new AWS.S3();
// interface UploadResponse {
//     Location: string;
//     Key: string;
//     Bucket: string;
// }

// const S3Service = {
//     // 3️⃣ פונקציה להעלאת קובץ
//     uploadFile: async (file: File, fileName: string, progress?: (progressEvent: AWS.S3.ManagedUpload.Progress) => void): Promise<UploadResponse> => {
//         const bucketName = import.meta.env.VITE_S3_BUCKET;
//         const folderName = import.meta.env.VITE_FOLDER_NAME || "";

//         if (!bucketName) {
//             throw new Error("Missing S3 bucket name in environment variables.");
//         }

//         const params: AWS.S3.PutObjectRequest = {
//             Bucket: bucketName,
//             Key: `${folderName}${fileName}`,
//             Body: file,
//             ContentType: file.type,
//         };

//         console.log("Uploading to S3:", params);

//         const upload = s3.upload(params);
//         if (progress) {
//             upload.on("httpUploadProgress", progress);
//         }

//         return upload.promise() as Promise<UploadResponse>;
//     },

//     // 4️⃣ יצירת URL להורדת קובץ
//     getFileUrl: (fileName: string): string => {
//         const bucketName = import.meta.env.VITE_S3_BUCKET;
//         const region = import.meta.env.VITE_REGION;
//         if (!bucketName || !region) {
//             throw new Error("Missing S3 bucket or region.");
//         }

//         return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//     },

//     // 5️⃣ מחיקת קובץ מה-S3
//     deleteFile: async (fileName: string): Promise<AWS.S3.DeleteObjectOutput> => {
//         const bucketName = import.meta.env.VITE_S3_BUCKET;
//         if (!bucketName) {
//             throw new Error("Missing S3 bucket.");
//         }

//         const params: AWS.S3.DeleteObjectRequest = {
//             Bucket: bucketName,
//             Key: fileName,
//         };

//         return s3.deleteObject(params).promise();
//     },

//     // 6️⃣ יצירת URL זמני לגישה לקובץ
//     generatePresignedUrl: (objectKey: string): string => {
//         const bucketName = import.meta.env.VITE_S3_BUCKET;
//         if (!bucketName) {
//             throw new Error("Missing S3 bucket.");
//         }

//         const params = {
//             Bucket: bucketName,
//             Key: objectKey,
//             Expires: 60 * 5, // תוקף של 5 דקות
//         };

//         const url = s3.getSignedUrl("getObject", params);
//         console.log("Generated Pre-signed URL:", url);
//         return url;
//     },
// };

// export default S3Service;
