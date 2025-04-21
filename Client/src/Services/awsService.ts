import AWS from 'aws-sdk';

// 1️⃣ יצירת פונקציה להחזרת הקונפיגורציה
const getAWSConfig = () => {
    const accessKeyId = import.meta.env.VITE_ACCESS_KEY;
    const secretAccessKey = import.meta.env.VITE_SECRET_KEY;
    const region = import.meta.env.VITE_REGION;

    if (!accessKeyId || !secretAccessKey || !region) {
        throw new Error("Missing AWS credentials. Please check your .env file.");
    }

    return {
        accessKeyId,
        secretAccessKey,
        region,
    };
};

// 2️⃣ טעינת הגדרות AWS
AWS.config.update(getAWSConfig());
AWS.config.credentials = new AWS.Credentials(
    import.meta.env.VITE_ACCESS_KEY,
    import.meta.env.VITE_SECRET_KEY
);
// 3️⃣ יצירת מופע של S3

const s3 = new AWS.S3();
interface UploadResponse {
    Location: string;
    Key: string;
    Bucket: string;
}

const S3Service = {
    // 3️⃣ פונקציה להעלאת קובץ
    uploadFile: async (file: File, fileName: string, progress?: (progressEvent: AWS.S3.ManagedUpload.Progress) => void): Promise<UploadResponse> => {
        const bucketName = import.meta.env.VITE_S3_BUCKET;
        const folderName = import.meta.env.VITE_FOLDER_NAME || "";

        if (!bucketName) {
            throw new Error("Missing S3 bucket name in environment variables.");
        }

        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: `${folderName}${fileName}`,
            Body: file,
            ContentType: file.type,
        };

        console.log("Uploading to S3:", params);

        const upload = s3.upload(params);
        if (progress) {
            upload.on("httpUploadProgress", progress);
        }

        return upload.promise() as Promise<UploadResponse>;
    },

    // 4️⃣ יצירת URL להורדת קובץ
    getFileUrl: (fileName: string): string => {
        const bucketName = import.meta.env.VITE_S3_BUCKET;
        const region = import.meta.env.VITE_REGION;
        if (!bucketName || !region) {
            throw new Error("Missing S3 bucket or region.");
        }

        return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    },

    // 5️⃣ מחיקת קובץ מה-S3
    deleteFile: async (fileName: string): Promise<AWS.S3.DeleteObjectOutput> => {
        const bucketName = import.meta.env.VITE_S3_BUCKET;
        if (!bucketName) {
            throw new Error("Missing S3 bucket.");
        }

        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: bucketName,
            Key: fileName,
        };

        return s3.deleteObject(params).promise();
    },

    // 6️⃣ יצירת URL זמני לגישה לקובץ
    generatePresignedUrl: (objectKey: string): string => {
        const bucketName = import.meta.env.VITE_S3_BUCKET;
        if (!bucketName) {
            throw new Error("Missing S3 bucket.");
        }

        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Expires: 60 * 5, // תוקף של 5 דקות
        };

        const url = s3.getSignedUrl("getObject", params);
        console.log("Generated Pre-signed URL:", url);
        return url;
    },
};

export default S3Service;
